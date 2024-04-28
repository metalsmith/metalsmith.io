const cookieBanner = document.getElementsByClassName('CookieBanner')[0];
const cookieBannerClose = document.getElementsByClassName('CookieBanner-close')[0];
const ls = window.localStorage;
const lsKey = 'metalsmith_cookie_policy_accepted';

cookieBannerClose.addEventListener('click', function (e) {
  e.preventDefault();
  cookieBanner.parentNode.removeChild(cookieBanner);
  if (ls) {
    ls.setItem(lsKey, Date.now());
  }
});

function initCookieBanner() {
  if (cookieBanner && ls) {
    const accepted = ls.getItem(lsKey);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(new Date().getMonth() - 2);

    if (!accepted || parseInt(accepted, 10) < twoMonthsAgo) {
      cookieBanner.style.display = 'block';
    }
  }
}

export default initCookieBanner;
