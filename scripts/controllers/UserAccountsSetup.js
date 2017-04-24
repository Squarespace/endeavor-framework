import { UserAccounts } from '@sqs/core';

function UserAccountsSetup (element) {
  const handleClick = (e) => {
    e.preventDefault();
    UserAccounts.openAccountScreen();
  };

  const initUserAccounts = () => {
    const signInLink = element.querySelector('.sign-in');
    const myAccountLink = element.querySelector('.my-account');
    const isUserAuthenticated = UserAccounts.isUserAuthenticated();

    if (signInLink && isUserAuthenticated) {
      element.querySelector('a').removeChild(signInLink);
    } else if (myAccountLink && !isUserAuthenticated) {
      element.querySelector('a').removeChild(myAccountLink);
    }

    element.classList.add('loaded');
    element.addEventListener('click', handleClick);
  };

  const destroy = () => {
    element.removeEventListener('click', handleClick);
  };

  initUserAccounts();

  return {
    destroy
  };
}

export default UserAccountsSetup;