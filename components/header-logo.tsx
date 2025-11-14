import Link from 'next/link'

export function HeaderLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-1 group">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest group-hover:text-gold-primary transition-colors">
          MODE
        </h1>
        <p className="text-xs sm:text-sm tracking-widest text-gold-primary">MEN MAG</p>
      </div>
    </Link>
  )
}
