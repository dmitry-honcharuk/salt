import { useAuth } from '@ficdev/auth-react';
import { getSpaceSet } from 'app/frontend/theme-selectors';
import { FunctionComponent } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { AuthenticateScreen } from '../screens/AuthenticateScreen';

type Props = { className?: string };

export const Layout: FunctionComponent<Props> = ({ children, className }) => {
  const { user, isFulfilled } = useAuth();

  if (!user && isFulfilled) {
    return <AuthenticateScreen />;
  }

  return (
    <>
      <Root className={className}>{children}</Root>
      <ToastContainer
        position="top-center"
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
    </>
  );
};

const Root = styled.div`
  padding: ${getSpaceSet(2)};
`;
