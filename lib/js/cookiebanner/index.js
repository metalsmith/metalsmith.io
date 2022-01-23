var cookieBanner = document.getElementsByClassName('CookieBanner')[0];
var cookieBannerClose = document.getElementsByClassName('CookieBanner-close')[0];
var ls = window.localStorage;
var lsKey = 'metalsmith_cookie_policy_accepted';

cookieBannerClose.addEventListener('click', function (e) {
  e.preventDefault();
  cookieBanner.parentNode.removeChild(cookieBanner);
  if (ls) {
    ls.setItem(lsKey, Date.now());
  }
});

function initCookieBanner() {
  if (cookieBanner && ls) {
    var accepted = ls.getItem(lsKey);
    var twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(new Date().getMonth() - 2);

    if (!accepted || parseInt(accepted, 10) < twoMonthsAgo) {
      cookieBanner.style.display = 'block';
    }
  }
}

module.exports = initCookieBanner;
