import Stripe from 'stripe'

let stripeClient: Stripe | null = null

/**
 * Cliente de Stripe perezoso: si STRIPE_SECRET_KEY no está configurada
 * (dev local sin las keys aún), lanza un error claro en el momento de uso
 * en vez de romper el build o cualquier página que ni siquiera use Stripe.
 */
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY no está configurada. Agrégala en .env.local (ver .env.example) para poder cobrar.'
    )
  }

  stripeClient = new Stripe(secretKey)
  return stripeClient
}
