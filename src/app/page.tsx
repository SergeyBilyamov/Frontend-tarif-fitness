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
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Закрепленный header */}
      <header className="sticky top-0 z-50 bg-[#1D5B43] h-[103px] flex flex-col items-center justify-center">
        <div className="text-white font-montserrat text-center mt-2 w-[447px] leading-[31px]">
          Успейте открыть пробную неделю
        </div>

        <div className="relative mt-1 flex items-center justify-center">
          {/* Звезды слева и справа */}
          <div className={`absolute left-[-24px] top-1/2 transform -translate-y-1/2 text-[14px] ${timeLeft <= 30 ? (timeLeft > 0 ? 'text-[#FF4E4E] animate-pulse' : 'text-white') : 'text-[#FFBB00]'}`}>★</div>
          <div className={`absolute right-[-24px] top-1/2 transform -translate-y-1/2 text-[14px] ${timeLeft <= 30 ? (timeLeft > 0 ? 'text-[#FF4E4E] animate-pulse' : 'text-white') : 'text-[#FFBB00]'}`}>★</div>

          <div
            className={`w-[113px] h-[52px] flex items-center justify-center text-lg font-semibold transition-all duration-300
              ${timeLeft <= 30 ? (timeLeft > 0 ? 'text-[#FF4E4E] animate-pulse' : 'text-white') : 'text-[#FFBB00]'}
            `}
          >
            {formattedTime}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        {/* Картинка человека */}
        <div className="flex justify-center mb-12">
          <img
            src="https://via.placeholder.com/400x300?text=Человек" // Замените на реальную картинку
            alt="Человек"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tariffs.map((tariff) => {
            const isSelected = selectedTariff === tariff.id
            const discount = Math.round(
              100 - (tariff.price / tariff.full_price) * 100
            )

            return (
              <button
                key={tariff.id}
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
      <footer className="mx-auto max-w-[1200px] px-6 py-8 text-center">
        <p className="text-white/60">Гарантия 30 дней</p>
      </footer>
    </main>
  )
}
