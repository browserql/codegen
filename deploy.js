const { exec } = require('child_process');
const { readFile, writeFile } = require('fs/promises');
const { promisify } = require('util');
const semverInc = require('semver/functions/inc');
const semverParse = require('semver/functions/parse');

async function run(commitMessage) {
  const pkg = JSON.parse((await readFile('package.json')).toString());

  const nextVersion = semverInc(pkg.version, 'patch');

  const nextBranch = `v${nextVersion}`;

  await writeFile(
    'package.json',
    JSON.stringify(
      {
        ...pkg,
        version: nextVersion,
      },
      null,
      2
    )
  );

  const { major, minor, patch } = semverParse(nextBranch);

  const majorBranch = `v${major}`;

  const minorBranch = `v${major}.${minor}`;

  await promisify(exec)(`git checkout -b ${nextBranch}`);

  await promisify(exec)('yarn build');

  await promisify(exec)('git add .');

  await promisify(exec)(`git commit --allow-empty -am "${nextBranch}"`);

  await promisify(exec)(`git push --set-upstream origin ${nextBranch}`);

  await promisify(exec)(`git checkout ${minorBranch}`);

  await promisify(exec)(`git merge ${nextBranch}`);

  await promisify(exec)('git add .');

  await promisify(exec)(`git commit --allow-empty -am "${minorBranch}"`);

  await promisify(exec)(`git push origin ${minorBranch}`);

  await promisify(exec)(`git checkout ${majorBranch}`);

  await promisify(exec)(`git merge ${minorBranch}`);

  await promisify(exec)('git add .');

  await promisify(exec)(`git commit --allow-empty -am "${majorBranch}"`);

  await promisify(exec)(`git push origin ${majorBranch}`);

  console.log(nextBranch);
}

const [, , commit] = process.argv;

run(commit);
