import { Metadata } from 'next';
import Image from 'next/image';
import { UserIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Us - CapitalMasters',
  description: 'Learn about CapitalMasters, our leadership team, and our commitment to excellence in investment management.',
};

const team = [
  {
    name: 'David Mukasa',
    role: 'Chief Executive Officer',
    bio: 'Over 25 years of experience in African investment markets and financial services, with deep expertise in continental economic development.',
    expertise: ['Strategic Planning', 'African Markets', 'Corporate Finance'],
  },
  {
    name: 'Amina Okonkwo',
    role: 'Chief Investment Officer',
    bio: 'Expert in African portfolio management with a proven track record of delivering consistent returns across emerging markets.',
    expertise: ['Portfolio Management', 'Asset Allocation', 'Market Analysis'],
  },
  {
    name: 'Kwame Mensah',
    role: 'Head of Research',
    bio: 'PhD in Economics from Oxford with extensive experience in African market analysis and continental economic forecasting.',
    expertise: ['Quantitative Analysis', 'Market Research', 'Economic Forecasting'],
  },
  {
    name: 'Fatima Nkrumah',
    role: 'Head of Client Relations',
    bio: 'Dedicated to ensuring exceptional client service and building long-term partnerships with investors worldwide.',
    expertise: ['Client Management', 'Financial Planning', 'Wealth Advisory'],
  },
];

const values = [
  {
    icon: ShieldCheckIcon,
    title: 'Integrity',
    description: 'We maintain the highest ethical standards in all our dealings.',
  },
  {
    icon: ChartBarIcon,
    title: 'Excellence',
    description: 'We strive for superior performance in everything we do.',
  },
  {
    icon: UserIcon,
    title: 'Client-First',
    description: 'Your success is our priority. We put your interests first always.',
  },
];

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-6">About CapitalMasters</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Building wealth through strategic investment management since 2008
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded in Kampala, Uganda in 2008, CapitalMasters emerged from a bold vision: to transform 
                Africa's economic landscape through disciplined, research-driven investment strategies. 
                We recognized that Africa's greatest untapped resource is its investment potential, and we set 
                out to channel global capital toward sustainable continental development.
              </p>
              <p>
                What started as a Ugandan investment firm has grown into a Pan-African financial powerhouse, 
                serving over 5,000 investors from around the world who share our belief in Africa's economic 
                future. Our success is rooted in our deep understanding of African markets, unwavering 
                commitment to transparency, and dedication to creating lasting prosperity across the continent.
              </p>
              <p>
                Today, we manage over $2.5 billion in assets strategically deployed across African markets 
                and global opportunities, combining local expertise with international best practices to 
                deliver superior returns while advancing Africa's economic transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To drive Africa's economic transformation by channeling global investment capital into strategic 
                opportunities across the continent. We empower individuals, institutions, and governments to achieve 
                their financial goals through innovative investment solutions rooted in African market expertise. 
                We build lasting partnerships based on trust, transparency, and our shared vision of a prosperous Africa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be Africa's premier investment management firm, leading the continent's economic renaissance 
                through strategic capital deployment and financial innovation. We envision an Africa where robust 
                investment ecosystems fuel sustainable development, create prosperity for all, and position the 
                continent as a global economic powerhouse for generations to come.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Core Values</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Integrity</h4>
                <p className="text-sm text-gray-600">Ethical conduct in all our operations</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">Continuous improvement and adaptation</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Transparency</h4>
                <p className="text-sm text-gray-600">Clear and honest communication</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Excellence</h4>
                <p className="text-sm text-gray-600">Commitment to superior results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Social Responsibility */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Corporate Social Responsibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in giving back to the communities we serve and promoting sustainable investment practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Environmental Stewardship
              </h3>
              <p className="text-gray-700">
                Promoting sustainable investments across Africa, supporting renewable energy projects, 
                conservation initiatives, and green businesses that protect our continent's natural heritage 
                while driving economic growth and creating jobs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Financial Literacy
              </h3>
              <p className="text-gray-700">
                Providing free educational workshops and resources across Uganda and East Africa, empowering 
                individuals and small businesses with investment knowledge, financial planning skills, and the 
                tools to participate in Africa's economic growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community Investment
              </h3>
              <p className="text-gray-700">
                Partnering with African entrepreneurs, supporting SMEs, funding infrastructure projects, and 
                backing community development initiatives that create sustainable jobs and strengthen local 
                economies across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to your financial success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Placeholder for team member image */}
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 h-64 flex items-center justify-center">
                  <UserIcon className="h-32 w-32 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      EXPERTISE:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Years of Excellence</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$2.5B+</div>
              <div className="text-primary-100">Assets Under Management</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <div className="text-primary-100">Satisfied Clients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Expert Professionals</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
