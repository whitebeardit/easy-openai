export const generateUser = () => {
  const user = {
    email: 'teste@whitebeard.dev',
    gpt: {
      secretKey: 'MY_OPENAI_SECRET_KEY',
    },
    name: 'Whitebeard Tester',
    password: 'password',
  };

  return user;
};
