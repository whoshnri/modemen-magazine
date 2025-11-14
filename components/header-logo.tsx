import Link from 'next/link'

export function HeaderLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-1 group">
      <div className="text-center">
     <p className="text-sm sm:text-lg tracking-widest text-gold-primary">MODEMEN MAG</p>
      </div>
    </Link>
  )
}
