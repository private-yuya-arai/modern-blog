const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const distDir = path.resolve(__dirname, '..', 'dist');
const repoUrl = 'https://github.com/private-yuya-arai/modern-blog.git';

try {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('Initializing temporary deployment repository...');
    process.chdir(distDir);

    // Create .nojekyll in dist if not already there
    fs.writeFileSync('.nojekyll', '');

    execSync('git init', { stdio: 'inherit' });
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });

    console.log('Pushing to gh-pages branch...');
    execSync(`git push -f ${repoUrl} master:gh-pages`, { stdio: 'inherit' });

    console.log('Deployment successful!');
} catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
}
