import { authServiceFactory } from 'app/implementations/services/authService';
import { cookieServiceFactory } from 'app/implementations/services/cookieService';
import { createRoute } from 'app/utils/api/route';
import { loginUserFactory } from 'core/use-cases/login';

export default createRoute().post(async (req, res) => {
  const { email, password } = req.body;

  const authService = authServiceFactory(cookieServiceFactory(req, res));

  const loginUser = loginUserFactory({ authService });

  await loginUser({ email, password });

  res.json({});
});
