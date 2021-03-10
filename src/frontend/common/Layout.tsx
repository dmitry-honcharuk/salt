import { spaceSet } from 'frontend/theme-selectors';
import { FunctionComponent } from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export const Layout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Root>{children}</Root>
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
    </>
  );
};

const Root = styled.div`
  padding: ${spaceSet(2)};
`;
