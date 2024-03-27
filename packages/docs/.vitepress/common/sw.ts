// 注册 Service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in window.navigator) {
    window.addEventListener('load', async function () {
      try {
        const registration = await navigator.serviceWorker.register('/ran/sw.js', {
          scope: '/ran/',
        });
        if (registration.installing) {
          console.log('installing Service worker');
        } else if (registration.waiting) {
          console.log('Service worker installed');
        } else if (registration.active) {
          console.log('Service worker active');
        }
      } catch (error) {
        console.error('service work register error:', JSON.stringify(error));
      }
    });
  }
};

registerServiceWorker();
