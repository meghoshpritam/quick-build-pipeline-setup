import { ResetMode, simpleGit } from 'simple-git';

export const cleanAndPullGit = async (repository: string, branch: string) => {
  let result = '';
  const git = simpleGit(repository);

  result += 'Cleaning untracked files...\n';
  result += await git.clean('df');

  result += '\nResetting repository...\n';
  result += await git.reset(ResetMode.HARD);

  result += '\nStashing changes...\n';
  result += await git.stash();

  result += '\nCleaning untracked files again...\n';
  result += await git.clean('df');

  result += '\nChecking out master branch...\n';
  result += await git.checkout('master');

  result += '\nChecking out all files...\n';
  result += await git.checkout('.');

  result += '\nPulling latest changes...\n';
  result += await git.pull('origin', branch, { '--rebase': 'true' });

  return result;
};
