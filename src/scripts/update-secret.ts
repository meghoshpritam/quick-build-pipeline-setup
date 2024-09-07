import fs from 'fs';
import bcrypt from 'bcrypt';

const ENV_FILE = '.env';

const updateSecret = () => {
  const password = process.argv[2];

  if (!password) {
    console.error('Please provide a password');
    process.exit(1);
  }

  const envFileContent = fs.readFileSync(ENV_FILE, 'utf8');
  const lines: string[] = envFileContent.split('\n') || [];

  const secretLineIndex = lines.findIndex((line: string) => line.startsWith('SECRET='));

  if (secretLineIndex === -1) {
    console.error('Secret not found in .env file');
    process.exit(1);
  }

  const hashedPassword = bcrypt.hashSync(password, 15);

  lines[secretLineIndex] = `SECRET="${hashedPassword}"`;

  fs.writeFileSync(ENV_FILE, lines.join('\n'));

  console.log('Secret updated successfully');
};

updateSecret();
