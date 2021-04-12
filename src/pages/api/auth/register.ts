import { authServiceFactory } from 'app/implementations/services/authService';
import { cookieServiceFactory } from 'app/implementations/services/cookieService';
import { createRoute } from 'app/utils/api/route';
import { registerUserFactory } from 'core/use-cases/register';

export default createRoute().post(async (req, res) => {
  const { email, password } = req.body;

  const authService = authServiceFactory(cookieServiceFactory(req, res));

  const registerUser = registerUserFactory({ authService });

  await registerUser({ email, password });

  res.json({});
});
