import type { PokemonDetalle, PokemonResumen } from '../types'

const BASE = 'https://pokeapi.co/api/v2'

export async function obtenerLista(limite = 30): Promise<PokemonResumen[]> {
  const res = await fetch(`${BASE}/pokemon?limit=${limite}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const datos = await res.json()
  return datos.results.map((r: { name: string }, i: number) => ({ id: i + 1, nombre: r.name }))
}

export async function obtenerDetalle(nombre: string): Promise<PokemonDetalle> {
  const res = await fetch(`${BASE}/pokemon/${encodeURIComponent(nombre)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  // La respuesta de PokéAPI es muy grande y aquí solo se leen 5 campos, validados justo debajo.
  // Por eso se usa any de forma deliberada y acotada (evita modelar toda la respuesta).
  const datos: any = await res.json()
  if (typeof datos?.id !== 'number' || typeof datos?.name !== 'string') throw new Error('Respuesta inesperada')
  return {
    id: datos.id,
    nombre: datos.name,
    sprite: datos.sprites?.front_default ?? null,
    tipos: (datos.types ?? []).map((t: { type: { name: string } }) => t.type.name),
    altura: datos.height,
    peso: datos.weight,
  }
}
