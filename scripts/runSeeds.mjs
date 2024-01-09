import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runSeeds() {
  const seedFiles = ['prisma/seeds/user.seed.ts', 'prisma/seeds/category.seed.ts'];

  for (const seedFile of seedFiles) {
    try {
      const { stdout, stderr } = await execAsync(`npx ts-node ${seedFile}`);
      if (stdout) console.log(`Result:\n${stdout}`);
      if (stderr) console.error(`Error:\n${stderr}`);
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

runSeeds();
