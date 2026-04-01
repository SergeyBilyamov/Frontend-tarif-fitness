// app/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'

interface Tariff {
  id: string
  period: string
  price: number
  full_price: number
  is_best: boolean
  text: string
}

export default function HomePage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [checkboxError, setCheckboxError] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [expired, setExpired] = useState(false)
  const [showExpiredBadge, setShowExpiredBadge] = useState(false)

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await fetch(
          'https://t-core.fit-hub.pro/Test/GetTariffs'
        )

        const data: Tariff[] = await response.json()

        setTariffs(data)

        const defaultTariff = data.find((item) => item.is_best)

        if (defaultTariff) {
          setSelectedTariff(defaultTariff.id)
        }
      } catch (error) {
        console.error('Ошибка загрузки тарифов', error)
      }
    }

    fetchTariffs()
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true)
      setShowExpiredBadge(true)
      setTimeout(() => setShowExpiredBadge(false), 400)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [timeLeft])

  const handleBuy = () => {
    if (!agree) {
      setCheckboxError(true)
      return
    }

    setCheckboxError(false)

    const currentTariff = tariffs.find((item) => item.id === selectedTariff)

    console.log('Покупка тарифа', currentTariff)
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center">
      {/* Закрепленный header */}
      <header className="sticky top-0 z-50 bg-[#1D5B43] h-[103px] flex flex-col items-center justify-center w-full">
        <div className="text-white font-montserrat text-center mt-2 w-[447px] leading-[31px]">
          Успейте открыть пробную неделю
        </div>

        <div className="relative mt-1 flex items-center justify-center">
          {/* Звезды слева и справа */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill={timeLeft <= 30 ? (timeLeft > 0 ? '#FF4E4E' : 'white') : '#FFBB00'}
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute left-[-8px] top-1/2 transform -translate-y-1/2 ${timeLeft <= 30 ? (timeLeft > 0 ? 'animate-pulse' : '') : ''}`}
          >
            <path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill={timeLeft <= 30 ? (timeLeft > 0 ? '#FF4E4E' : 'white') : '#FFBB00'}
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute right-[-8px] top-1/2 transform -translate-y-1/2 ${timeLeft <= 30 ? (timeLeft > 0 ? 'animate-pulse' : '') : ''}`}
          >
            <path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" />
          </svg>

          <div
            className={`w-[136px] h-[44px] flex items-center justify-center text-[40px] leading-[44px] font-Raleway Thin font-bold transition-all duration-300
              ${timeLeft <= 30 ? (timeLeft > 0 ? 'text-[#FF4E4E]' : 'text-white') : 'text-[#FFBB00]'}
            `}
          >
            {formattedTime}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] w-full px-6">
        <section className="py-12">
          <p className="text-left font-montserrat font-bold text-[40px] text-white pt-[50px]">Выбери подходящий для себя <span className="text-[#FDB056]">тариф</span></p>

          {/* Картинка человека */}
          <div className="flex justify-center mb-12">
            <img
              src="https://via.placeholder.com/400x300?text=%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA" // Замените на реальную картинку
              alt="Человек"
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
{tariffs.map((tariff, idx) => {
              const isSelected = selectedTariff === tariff.id
              const discount = Math.round(
                100 - (tariff.price / tariff.full_price) * 100
              )

              return (
                <button
                  key={`${tariff.id || 'tariff'}-${idx}`}
                  type="button"
                  onClick={() => setSelectedTariff(tariff.id)}
                  className={`relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300
                    ${
                      isSelected
                        ? 'border-[#9EFF00] bg-[#9EFF00]/10 shadow-[0_0_30px_rgba(158,255,0,0.35)] scale-[1.02]'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }
                    ${tariff.is_best ? 'xl:col-span-2' : ''}
                  `}
                >
                  {tariff.is_best && (
                    <div className="absolute left-6 top-6 rounded-full bg-[#9EFF00] px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
                      Лучший выбор
                    </div>
                  )}

                  <div className="mt-10 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{tariff.period}</h2>
                      <p className="mt-2 text-sm text-white/60">{tariff.text}</p>
                    </div>

                    <div className="rounded-2xl bg-red-500 px-3 py-1 text-sm font-bold text-white">
                      -{discount}%
                    </div>
                  </div>

                  <div className="mt-8 flex items-end gap-3 relative">
                    <div
                      className={`text-4xl font-black transition-all duration-500
                        ${expired ? 'text-white/40' : 'text-[#9EFF00]'}
                      `}
                    >
                      {expired ? tariff.full_price : tariff.price} ₽
                    </div>

                    <div className={`text-lg text-white/40 line-through transition-opacity duration-500 ${expired ? 'opacity-0' : 'opacity-100'}`}>
                      {tariff.full_price} ₽
                    </div>

                    {showExpiredBadge && (
                      <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
                        Скидка закончилась
                      </div>
                    )}
                  </div>

                  <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300
                        ${isSelected ? 'w-full bg-[#9EFF00]' : 'w-0'}
                      `}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-300
                ${
                  checkboxError
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-white/10'
                }
              `}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked)
                  setCheckboxError(false)
                }}
                className="mt-1 h-5 w-5 accent-[#9EFF00]"
              />

              <span className="text-sm leading-6 text-white/70">
                Я согласен с условиями покупки и обработки персональных данных
              </span>
            </label>

            <button
              onClick={handleBuy}
              className="mt-6 flex h-16 w-full items-center justify-center rounded-2xl bg-[#9EFF00] text-lg font-bold text-black
                animate-[buyBlink_1.5s_infinite] transition hover:scale-[1.01]"
            >
              Купить
            </button>
          </div>
        </section>

        {/* Footer с гарантией */}
        <footer className="py-8 text-center w-full">
          <p className="text-white/60">Гарантия 30 дней</p>
        </footer>
      </div>
    </main>
  )
}
