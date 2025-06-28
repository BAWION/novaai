// Start backend API server for NovaAI University
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting NovaAI University backend API server...');

const serverProcess = spawn('node', ['working-server.cjs'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  cwd: process.cwd(),
  detached: false
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code, signal) => {
  console.log(`Server process exited with code ${code} and signal ${signal}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down backend server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Terminating backend server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});