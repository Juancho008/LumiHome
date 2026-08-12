import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  clearAdminToken,
  createProduct,
  deleteProduct,
  getAdminToken,
  loginAdmin,
  saveBanners,
  saveCategories,
  updateProduct,
} from '../lib/api'
import { fileToWebpDataUrl } from '../lib/toWebp'
import { useCatalog } from '../context/CatalogContext'
import type {
  CatalogBanner,
  CatalogCategory,
  CatalogColor,
  CatalogProduct,
} from '../types/catalog'
import { Logo } from '../components/Logo'

type Tab = 'banners' | 'categories' | 'products'

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (dataUrl: string) => void
}) {
  const [busy, setBusy] = useState(false)

  const onFile = async (file: File | null) => {
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await fileToWebpDataUrl(file)
      onChange(dataUrl)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al convertir imagen')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-2 flex items-start gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden bg-[#efece6]">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-muted">Sin img</div>
          )}
        </div>
        <label className="inline-flex cursor-pointer bg-ink px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-gold hover:text-ink">
          {busy ? 'Convirtiendo…' : 'Subir WebP'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
    </div>
  )
}

export function AdminPage() {
  const { catalog, setCatalog, refresh, loading } = useCatalog()
  const [authed, setAuthed] = useState(Boolean(getAdminToken()))
  const [tokenInput, setTokenInput] = useState('')
  const [tab, setTab] = useState<Tab>('banners')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [banners, setBanners] = useState<CatalogBanner[]>([])
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null)

  useEffect(() => {
    setBanners(catalog.banners)
    setCategories(catalog.categories)
  }, [catalog])

  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await loginAdmin(tokenInput.trim())
      setAuthed(true)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fallido')
    }
  }

  const onLogout = () => {
    clearAdminToken()
    setAuthed(false)
    setTokenInput('')
  }

  const withSave = async (fn: () => Promise<typeof catalog>) => {
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      const next = await fn()
      setCatalog(next)
      setStatus('Guardado correctamente')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      return false
    } finally {
      setSaving(false)
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream px-4">
        <form
          onSubmit={(e) => void onLogin(e)}
          className="w-full max-w-md border border-line bg-white/40 p-8"
        >
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="mt-6 text-center font-serif text-2xl tracking-[0.08em] text-ink">
            Panel admin
          </h1>
          <p className="mt-2 text-center text-[12px] text-muted">
            Ingresá tu contraseña para continuar
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            className="mt-6 w-full border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-ink"
            required
          />
          {error ? <p className="mt-3 text-[12px] text-red-700">{error}</p> : null}
          <button
            type="submit"
            className="mt-5 w-full bg-ink py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream hover:bg-gold hover:text-ink"
          >
            Entrar
          </button>
          <Link
            to="/"
            className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
          >
            Volver a la tienda
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-cream text-ink">
      <header className="border-b border-line bg-[#f3f1ec]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              Ver tienda
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <nav className="flex flex-wrap gap-2 border-b border-line pb-4">
          {(
            [
              ['banners', 'Banners'],
              ['categories', 'Categorías'],
              ['products', 'Productos'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                tab === id ? 'bg-ink text-cream' : 'bg-transparent text-ink hover:bg-ink/5'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {loading ? <p className="mt-6 text-sm text-muted">Cargando catálogo…</p> : null}
        {status ? <p className="mt-4 text-[12px] text-emerald-800">{status}</p> : null}
        {error ? <p className="mt-4 text-[12px] text-red-700">{error}</p> : null}

        {tab === 'banners' ? (
          <section className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl tracking-[0.06em]">Banners principales</h2>
              <button
                type="button"
                onClick={() =>
                  setBanners((prev) => [
                    ...prev,
                    {
                      id: newId('banner'),
                      title: 'Nuevo banner',
                      subtitle: '',
                      cta: 'Ver más',
                      image: '',
                    },
                  ])
                }
                className="bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-cream hover:bg-gold hover:text-ink"
              >
                Agregar
              </button>
            </div>

            {banners.map((banner, index) => (
              <article key={banner.id} className="border border-line bg-white/30 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-[12px]">
                    Título
                    <input
                      value={banner.title}
                      onChange={(e) =>
                        setBanners((prev) =>
                          prev.map((b, i) => (i === index ? { ...b, title: e.target.value } : b)),
                        )
                      }
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block text-[12px]">
                    CTA
                    <input
                      value={banner.cta}
                      onChange={(e) =>
                        setBanners((prev) =>
                          prev.map((b, i) => (i === index ? { ...b, cta: e.target.value } : b)),
                        )
                      }
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block text-[12px] md:col-span-2">
                    Subtítulo
                    <input
                      value={banner.subtitle}
                      onChange={(e) =>
                        setBanners((prev) =>
                          prev.map((b, i) =>
                            i === index ? { ...b, subtitle: e.target.value } : b,
                          ),
                        )
                      }
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <ImageUpload
                    label="Imagen del banner"
                    value={banner.image}
                    onChange={(image) =>
                      setBanners((prev) =>
                        prev.map((b, i) => (i === index ? { ...b, image } : b)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setBanners((prev) => prev.filter((_, i) => i !== index))}
                  className="mt-4 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
                >
                  Eliminar banner
                </button>
              </article>
            ))}

            <button
              type="button"
              disabled={saving}
              onClick={() => void withSave(() => saveBanners(banners))}
              className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar banners'}
            </button>
          </section>
        ) : null}

        {tab === 'categories' ? (
          <section className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl tracking-[0.06em]">Categorías</h2>
              <button
                type="button"
                onClick={() =>
                  setCategories((prev) => [
                    ...prev,
                    { id: newId('cat'), title: 'Nueva categoría', cta: 'Ver más', image: '' },
                  ])
                }
                className="bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-cream hover:bg-gold hover:text-ink"
              >
                Crear categoría
              </button>
            </div>

            {categories.map((category, index) => (
              <article key={category.id} className="border border-line bg-white/30 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-[12px]">
                    Título
                    <input
                      value={category.title}
                      onChange={(e) =>
                        setCategories((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, title: e.target.value } : c)),
                        )
                      }
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block text-[12px]">
                    CTA
                    <input
                      value={category.cta}
                      onChange={(e) =>
                        setCategories((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, cta: e.target.value } : c)),
                        )
                      }
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <ImageUpload
                    label="Imagen"
                    value={category.image}
                    onChange={(image) =>
                      setCategories((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, image } : c)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCategories((prev) => prev.filter((_, i) => i !== index))}
                  className="mt-4 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
                >
                  Eliminar categoría
                </button>
              </article>
            ))}

            <button
              type="button"
              disabled={saving}
              onClick={() => void withSave(() => saveCategories(categories))}
              className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar categorías'}
            </button>
          </section>
        ) : null}

        {tab === 'products' ? (
          <ProductsAdmin
            products={catalog.products}
            categories={catalog.categories}
            editing={editingProduct}
            setEditing={setEditingProduct}
            saving={saving}
            onCreate={async (product) => {
              const ok = await withSave(() => createProduct(product))
              if (ok) setEditingProduct(null)
            }}
            onUpdate={async (product) => {
              const ok = await withSave(() => updateProduct(product.id, product))
              if (ok) setEditingProduct(null)
            }}
            onDelete={(id) => void withSave(() => deleteProduct(id))}
          />
        ) : null}
      </div>
    </div>
  )
}

function emptyProduct(categories: CatalogCategory[]): CatalogProduct {
  return {
    id: newId('prod'),
    name: '',
    price: '',
    description: '',
    categoryId: categories[0]?.id,
    colors: [{ name: 'Natural', hex: '#C9B8A0', image: '' }],
  }
}

function ProductsAdmin({
  products,
  categories,
  editing,
  setEditing,
  saving,
  onCreate,
  onUpdate,
  onDelete,
}: {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  editing: CatalogProduct | null
  setEditing: (p: CatalogProduct | null) => void
  saving: boolean
  onCreate: (p: CatalogProduct) => void | Promise<void>
  onUpdate: (p: CatalogProduct) => void | Promise<void>
  onDelete: (id: string) => void
}) {
  const isNew = editing ? !products.some((p) => p.id === editing.id) : false

  const updateColor = (index: number, patch: Partial<CatalogColor>) => {
    if (!editing) return
    setEditing({
      ...editing,
      colors: editing.colors.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    })
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl tracking-[0.06em]">Productos</h2>
        <button
          type="button"
          onClick={() => setEditing(emptyProduct(categories))}
          className="bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-cream hover:bg-gold hover:text-ink"
        >
          Nuevo producto
        </button>
      </div>

      <div className="grid gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={product.colors[0]?.image || ''}
                alt=""
                className="h-14 w-12 object-cover bg-[#efece6]"
              />
              <div>
                <p className="font-serif text-lg">{product.name}</p>
                <p className="text-[12px] text-muted">{product.price}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(structuredClone(product))}
                className="text-[10px] uppercase tracking-[0.14em] hover:text-gold"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar ${product.name}?`)) onDelete(product.id)
                }}
                className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="border border-line bg-white/40 p-5">
          <h3 className="font-serif text-xl tracking-[0.04em]">
            {isNew ? 'Crear producto' : 'Editar producto'}
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-[12px]">
              Nombre
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
              />
            </label>
            <label className="block text-[12px]">
              Precio
              <input
                value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                placeholder="$189.000"
                className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
              />
            </label>
            <label className="block text-[12px] md:col-span-2">
              Descripción
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
              />
            </label>
            <label className="block text-[12px]">
              Categoría
              <select
                value={editing.categoryId || ''}
                onChange={(e) =>
                  setEditing({ ...editing, categoryId: e.target.value || undefined })
                }
                className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em]">
                Colores disponibles
              </p>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    colors: [
                      ...editing.colors,
                      { name: 'Nuevo', hex: '#C5A059', image: '' },
                    ],
                  })
                }
                className="text-[10px] uppercase tracking-[0.14em] hover:text-gold"
              >
                Agregar color
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {editing.colors.map((color, index) => (
                <div key={index} className="grid gap-4 border border-line p-4 md:grid-cols-[1fr_auto_1fr]">
                  <label className="block text-[12px]">
                    Nombre del color
                    <input
                      value={color.name}
                      onChange={(e) => updateColor(index, { name: e.target.value })}
                      className="mt-1 w-full border border-line bg-cream px-3 py-2 outline-none focus:border-ink"
                    />
                  </label>
                  <label className="block text-[12px]">
                    Color
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, { hex: e.target.value })}
                      className="mt-1 h-10 w-16 cursor-pointer border border-line bg-cream p-1"
                    />
                  </label>
                  <ImageUpload
                    label="Imagen de este color"
                    value={color.image}
                    onChange={(image) => updateColor(index, { image })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        colors: editing.colors.filter((_, i) => i !== index),
                      })
                    }
                    className="text-left text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink md:col-span-3"
                  >
                    Quitar color
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving || !editing.name || editing.colors.length === 0}
              onClick={() => {
                if (isNew) void onCreate(editing)
                else void onUpdate(editing)
              }}
              className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
            >
              {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
