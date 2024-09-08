import fs from 'fs';
import bcrypt from 'bcrypt';

const ENV_FILE = '.env';
const PASSWORD_FILE = 'password.txt';

const getPassword = () => {
  if (!fs.existsSync(PASSWORD_FILE)) {
    console.error(`${PASSWORD_FILE} is missing.`);
    process.exit(1);
  }

  const password = fs.readFileSync(PASSWORD_FILE, 'utf-8').trim();

  if (!password) {
    console.error('Password is empty');
    process.exit(1);
  }

  fs.writeFileSync(PASSWORD_FILE, '');

  return password;
};

const updateSecret = () => {
  const password = getPassword();

  const envFileContent = fs.readFileSync(ENV_FILE, 'utf8');
  const lines: string[] = envFileContent.split('\n') || [];

  const secretLineIndex = lines.findIndex((line: string) => line.startsWith('SECRET='));

  if (secretLineIndex === -1) {
    console.error('Secret not found in .env file');
    process.exit(1);
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  lines[secretLineIndex] = `SECRET="${hashedPassword}"`;

  fs.writeFileSync(ENV_FILE, lines.join('\n'));

  console.log('Secret updated successfully');
};

updateSecret();
