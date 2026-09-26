import { useEffect, useState } from 'react';
import { MOMENTOS, pasosDelMomento, leerMarcados, guardarMarcados } from '../rutina';
import { rutaFoto } from '../foto';

const Sol = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4m0-12.8l-1.4 1.4m-10 10l-1.4 1.4" />
  </svg>
);

const Luna = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
  </svg>
);

function Rutina({ momento, productos }) {
  const pasos = pasosDelMomento(productos, momento);
  const [marcados, setMarcados] = useState(() => leerMarcados());

  // Si cambio de mañana a noche, releo lo guardado: cada momento lleva su
  // propia cuenta dentro del mismo día.
  useEffect(() => {
    setMarcados(leerMarcados());
  }, [momento]);

  const hechos = marcados[momento] ?? [];

  const alternar = (id) => {
    const siguiente = hechos.includes(id)
      ? hechos.filter((uno) => uno !== id)
      : [...hechos, id];

    const actualizado = { ...marcados, [momento]: siguiente };
    setMarcados(actualizado);
    guardarMarcados(actualizado);
  };

  const reiniciar = () => {
    const actualizado = { ...marcados, [momento]: [] };
    setMarcados(actualizado);
    guardarMarcados(actualizado);
  };

  const esDia = momento === 'manana';
  const completados = pasos.filter((paso) => hechos.includes(paso._id)).length;
  const terminada = pasos.length > 0 && completados === pasos.length;

  if (pasos.length === 0) {
    return (
      <div className="tarjeta p-10 text-center">
        <p className="text-sm text-suave">
          No hay productos para {esDia ? 'la mañana' : 'la noche'} todavía.
        </p>
        <p className="mt-1 text-sm text-suave">
          Añade uno y marca su momento de uso para que aparezca aquí.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              esDia ? 'bg-dia-claro text-dia' : 'bg-noche-claro text-noche'
            }`}
          >
            {esDia ? <Sol /> : <Luna />}
          </span>
          <div>
            <h2 className="text-base font-medium">{MOMENTOS[momento].titulo}</h2>
            <p className="text-sm text-suave">
              {completados} de {pasos.length} pasos
            </p>
          </div>
        </div>

        {completados > 0 && (
          <button type="button" onClick={reiniciar} className="text-sm text-suave underline underline-offset-4 hover:text-tinta">
            Empezar de nuevo
          </button>
        )}
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-borde">
        <div
          className={`h-full transition-all duration-300 ${esDia ? 'bg-dia' : 'bg-noche'}`}
          style={{ width: `${(completados / pasos.length) * 100}%` }}
        />
      </div>

      {terminada && (
        <p className="rounded-lg bg-acento-claro px-4 py-3 text-sm text-acento">
          Rutina de {esDia ? 'mañana' : 'noche'} completa.
        </p>
      )}

      <ol className="flex flex-col gap-2">
        {pasos.map((paso, indice) => {
          const hecho = hechos.includes(paso._id);
          const foto = rutaFoto(paso.foto);

          return (
            <li key={paso._id}>
              <button
                type="button"
                onClick={() => alternar(paso._id)}
                aria-pressed={hecho}
                className={`tarjeta flex w-full items-center gap-4 p-4 text-left transition ${
                  hecho ? 'opacity-55' : 'hover:border-suave/40'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                    hecho
                      ? esDia
                        ? 'border-dia bg-dia text-nieve'
                        : 'border-noche bg-noche text-nieve'
                      : 'border-borde text-suave'
                  }`}
                >
                  {hecho ? '✓' : indice + 1}
                </span>

                {foto && (
                  <img
                    src={foto}
                    alt=""
                    loading="lazy"
                    className="h-[72px] w-[72px] shrink-0 rounded-lg bg-hueso object-contain p-1.5"
                  />
                )}

                <span className="min-w-0 flex-1">
                  <span className="etiqueta block">{paso.categoria}</span>
                  <span className={`block font-medium ${hecho ? 'line-through' : ''}`}>
                    {paso.nombre}
                  </span>
                  <span className="block truncate text-sm text-suave">
                    {paso.marca}
                    {paso.ingredienteClave ? ` · ${paso.ingredienteClave}` : ''}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default Rutina;
