import { ResetMode, simpleGit } from 'simple-git';

export const cleanAndPullGit = async (repository: string, branch: string) => {
  let result = '';
  let res;
  const git = simpleGit(repository);

  result += 'Cleaning untracked files...\n';
  res = await git.clean('df');
  result += JSON.stringify(res, null, 2);

  result += '\nResetting repository...\n';
  res = await git.reset(ResetMode.HARD);
  result += JSON.stringify(res, null, 2);

  result += '\nStashing changes...\n';
  res = await git.stash();
  result += JSON.stringify(res, null, 2);

  result += '\nCleaning untracked files again...\n';
  res = await git.clean('df');
  result += JSON.stringify(res, null, 2);

  result += `\nChecking out ${branch} branch...\n`;
  res = await git.checkout(branch);
  result += JSON.stringify(res, null, 2);

  result += '\nChecking out all files...\n';
  res = await git.checkout('.');
  result += JSON.stringify(res, null, 2);

  result += '\nPulling latest changes...\n';
  res = await git.pull('origin', branch, { '--rebase': 'true' });
  result += JSON.stringify(res, null, 2);

  return result;
};
