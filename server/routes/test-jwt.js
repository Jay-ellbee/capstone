import jwt from 'jsonwebtoken';

const SECRET_KEY = '709899942c46ff3fa702ade55360d5dfc8381eb1b2689dda966048f0aaba355c349fd171290e676efa5c848152fd000ea83868965c823cb53afe158b43058dff';

try {
    const token = jwt.sign({ user_type: 'admin', email: 'admin@example.com' }, SECRET_KEY, { expiresIn: '1h' });
    console.log('Generated JWT:', token);
} catch (err) {
    console.error('Error generating JWT:', err);
}
