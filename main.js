import Pi from '@minepi/pi-sdk';

const pi = new Pi({
  sandbox: true,
  appName: 'clickerquest3226',
});

document.getElementById('btnLogin').addEventListener('click', async () => {
  try {
    const user = await pi.login();
    console.log('User logged in:', user);
    alert(`Welcome ${user.username}`);
  } catch (error) {
    console.error('Login failed', error);
    alert('Login failed');
  }
});
