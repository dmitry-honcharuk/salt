import { getSpaceSet } from 'app/frontend/theme-selectors';
import { FC, FunctionComponent } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { NEXT_PUBLIC_AUTH_CLIENT_ID } from '../../config/env';
import { AuthProvider, useAuth } from '../auth';
import { AuthenticateScreen } from '../screens/AuthenticateScreen';

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <AuthProvider
      clientId={NEXT_PUBLIC_AUTH_CLIENT_ID}
      audience='http://localhost:3000'
    >
      <App>{children}</App>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        closeButton={false}
      />
    </AuthProvider>
  );
};

const App: FC = ({ children }) => {
  const { user, isFulfilled } = useAuth();

  console.log({ user, isFulfilled });

  if (!user && isFulfilled) {
    return <AuthenticateScreen />;
  }

  return <Root>{children}</Root>;
};

const Root = styled.div`
  padding: ${getSpaceSet(2)};
`;
