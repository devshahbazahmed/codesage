import React from 'react';
import SocialLoginButton from './SocialLoginButton';
import { signInWithGithub } from '../actions';

type GithubSignInFormProps = {
  callbackUrl?: string;
};

const GithubSignInForm = ({ callbackUrl }: GithubSignInFormProps) => {
  return (
    <form action={signInWithGithub} className="w-full">
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}
      <SocialLoginButton />
    </form>
  );
};

export default GithubSignInForm;
