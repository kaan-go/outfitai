import { Link } from 'react-router-dom'

const exampleOutfits = [
  {
    style: 'Streetwear',
    prompt: 'Oversized hoodie, cargo pants, Air Force 1',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    style: 'Minimal',
    prompt: 'White tee, black trousers, leather loafers',
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    style: 'Cyberpunk',
    prompt: 'Techwear jacket, joggers, chunky sneakers',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    style: 'Casual Chic',
    prompt: 'Blazer, jeans, white sneakers',
    gradient: 'from-amber-500 to-orange-600',
  },
]

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Outfit Generation',
    desc: 'Describe your ideal outfit and watch AI bring it to life on your avatar.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Personal Avatar',
    desc: 'Upload your photos or create a body profile for realistic outfit previews.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'Shop the Look',
    desc: 'Like an outfit? We find real products from top brands so you can buy it instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Generation History',
    desc: 'Access all your past outfits, liked looks, and saved styles anytime.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Landing Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl text-dark">OutfitAI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-gray hover:text-dark transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray hover:text-dark transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray hover:text-dark transition-colors">Login</Link>
              <Link to="/signup" className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            AI-Powered Fashion
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-dark leading-tight mb-6">
            Create Your Perfect
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Outfit
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray max-w-2xl mx-auto mb-10 leading-relaxed">
            Try clothes before you buy. Generate realistic outfit photos with AI,
            discover matching products, and shop the look — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 text-lg"
            >
              Generate Your Outfit
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-dark font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Example Gallery */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">AI Outfit Examples</h2>
            <p className="text-gray text-lg max-w-xl mx-auto">
              See what our AI can generate from simple text prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleOutfits.map((outfit) => (
              <div
                key={outfit.style}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className={`aspect-[3/4] bg-gradient-to-br ${outfit.gradient} flex items-end`}>
                  <div className="w-full p-5 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                      {outfit.style}
                    </span>
                    <p className="text-white text-sm mt-1 leading-snug">{outfit.prompt}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">How It Works</h2>
            <p className="text-gray text-lg max-w-xl mx-auto">
              From prompt to purchase in just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Simple Pricing</h2>
            <p className="text-gray text-lg max-w-xl mx-auto">
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-dark mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark">$0</span>
                <span className="text-gray ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 generations / month
                </li>
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic avatar creation
                </li>
                <li className="flex items-center gap-3 text-gray-light line-through">
                  <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Shopping recommendations
                </li>
                <li className="flex items-center gap-3 text-gray-light line-through">
                  <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Premium styles
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 text-center font-semibold rounded-xl border-2 border-gray-200 text-dark hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-primary p-8 relative hover:shadow-lg hover:shadow-primary/10 transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                POPULAR
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark">$19</span>
                <span className="text-gray ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited generations
                </li>
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Product suggestions
                </li>
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium styles
                </li>
                <li className="flex items-center gap-3 text-gray">
                  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority generation
                </li>
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 text-center font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Start Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-dark text-white/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-lg text-white">OutfitAI</span>
          </div>
          <p className="text-sm">&copy; 2026 OutfitAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
