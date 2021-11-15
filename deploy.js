const { exec } = require('child_process');
const { readFile, writeFile } = require('fs/promises');
const { promisify } = require('util');
const semverInc = require('semver/functions/inc');

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

  await promisify(exec)(`git checkout -b ${nextBranch}`);

  await promisify(exec)('yarn build');

  await promisify(exec)('git add .');

  await promisify(exec)(`git commit -am "${nextBranch}"`);

  await promisify(exec)(`git push --set-upstream origin ${nextBranch}`);

  console.log(nextBranch);
}

const [, , commit] = process.argv;

run(commit);
