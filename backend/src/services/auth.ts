import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    return false;
  }
};

export const generateToken = (user: { id: number; email: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
