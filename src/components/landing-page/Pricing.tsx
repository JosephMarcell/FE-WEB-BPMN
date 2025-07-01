import React from 'react';

const plans = [
  {
    name: 'Free',
    price: 'Rp0',
    description: 'Cocok untuk pemula yang ingin mencoba fitur dasar BPMN Analysis.',
    features: [
      'Diagram BPMN tak terbatas',
      'Export ke XML',
      'Akses komunitas',
    ],
    button: 'Mulai Gratis',
    highlight: false,
  },
  {
    name: 'Professional',
    price: 'Rp99.000/bulan',
    description: 'Untuk profesional yang membutuhkan fitur analisis lanjutan.',
    features: [
      'Semua fitur Free',
      'Analisis otomatis',
      'Kolaborasi tim',
      'Prioritas support',
    ],
    button: 'Pilih Professional',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'Rp299.000/bulan',
    description: 'Solusi lengkap untuk tim dan perusahaan skala besar.',
    features: [
      'Semua fitur Professional',
      'Integrasi API',
      'Manajemen pengguna',
      'Dukungan SLA',
    ],
    button: 'Hubungi Kami',
    highlight: false,
  },
];

const Pricing: React.FC = () => (
  <section id="Pricing" className="py-16 dark:bg-gray-900">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl font-bold text-[#0078C1] dark:text-[#00a1ff] mb-4">
        Pricing Plans
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Pilih paket yang sesuai kebutuhan Anda untuk memaksimalkan analisis BPMN.
      </p>
    </div>
    <div className="flex flex-col gap-8 items-center justify-center md:flex-row md:gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col rounded-2xl shadow-lg bg-white dark:bg-[#112e52] p-8 w-80 border transition-transform duration-300 ${
            plan.highlight
              ? 'border-[#0078C1] scale-105'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className="text-xl font-bold mb-2 text-[#0078C1] dark:text-[#00a1ff]">{plan.name}</h3>
          <div className="text-3xl font-extrabold mb-2">{plan.price}</div>
          <p className="text-gray-500 dark:text-gray-300 mb-4">{plan.description}</p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="mr-2 text-[#0078C1] dark:text-[#00a1ff]">✔</span>
                {feature}
              </li>
            ))}
          </ul>
          <button
            className={`rounded-full px-6 py-2 font-semibold transition-colors duration-200 ${
              plan.highlight
                ? 'bg-[#0078C1] text-white hover:bg-[#005c97]'
                : 'bg-gray-200 text-[#0078C1] hover:bg-gray-300 dark:bg-gray-800 dark:text-[#00a1ff] dark:hover:bg-[#193a5a]'
            }`}
          >
            {plan.button}
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing;