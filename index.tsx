
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Menu, Search, Bell, User, ChevronRight, MessageSquare, Share2, 
  Bookmark, X as CloseIcon, Camera, Send, CheckCircle, AlertCircle, 
  TrendingUp, Shield, FileText, Users, DollarSign, 
  LayoutGrid, PenTool, Image as ImageIcon, Sun, Moon,
  CreditCard, Trash2, Lock, Globe, Home, Briefcase,
  Link as LinkIcon, Video, Plus, Edit3
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Custom Social Icons for Exact Branding ---

const SocialIcons = {
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  ),
  YouTube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
};

// --- Types ---

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  date: string;
  articleId: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  views: string;
  isBreaking?: boolean;
  isSponsored?: boolean;
}

interface Advertisement {
  id: string;
  clientName: string;
  email: string;
  plan: 'Sidebar Banner' | 'Sponsored Article' | 'Header Leaderboard';
  amount: number;
  status: 'Pending' | 'Active' | 'Rejected';
  dateSubmitted: string;
  receiptImage: string; // Base64
  adImage?: string; // Base64 for the actual ad
  adContent?: string; // Text content for sponsored articles
  adUrl?: string; // Optional destination URL
  adHeadline?: string; // Headline for sponsored articles
}

// --- Mock Data ---

const INITIAL_ARTICLES: Article[] = [
  {
    id: 't-1',
    title: 'The Dangote Revolution: Nigeria’s Path to Energy Independence',
    category: 'Business',
    author: 'Adebayo Olushola',
    date: '10 mins ago',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'As the Dangote Refinery begins full-scale operations, the landscape of Nigeria’s downstream oil sector undergoes a seismic shift.',
    content: `Nigeria’s decades-long reliance on imported refined petroleum products is finally nearing an end as the world-class Dangote Refinery ramps up its daily production. This massive industrial complex, situated in the Lekki Free Trade Zone, represents the largest single-train refinery globally and carries the weight of a nation’s economic expectations on its shoulders.

The immediate impact is already being felt in the logistical chains of the country. By refining locally, the massive costs associated with shipping crude oil abroad and bringing back refined petrol—including insurance, demurrage, and landing costs—are expected to be drastically reduced. This shift isn't just about fuel; it's about the foreign exchange savings that could stabilize the Naira.

However, the transition is not without its teething problems. Pricing disputes between the refinery and the national petroleum corporation have sparked intense national debate over the true cost of energy. Citizens remain cautiously optimistic, watching the pumps closely to see if the promised reduction in retail prices will actually manifest in their daily lives.

From an industrial perspective, the refinery is a catalyst for satellite businesses. The production of polypropylene and other petrochemicals will provide raw materials for thousands of manufacturing plants across West Africa, potentially lowering the cost of consumer goods ranging from plastics to textiles.

International energy analysts are also watching closely. A self-sufficient Nigeria means a significant shift in global oil trade patterns, as one of the world's largest importers of refined products suddenly becomes a potential exporter. This could redefine Nigeria's geopolitical influence within the OPEC+ framework and across the African continent.

Critics, however, point to the environmental footprint of such a massive facility. As the world pushes toward a green transition, Nigeria is doubling down on fossil fuels. Proponents argue that industrialization must precede transition for developing economies, and the refinery is a necessary step toward building the capital needed for future green investments.

Ultimately, the Dangote Refinery is more than just a business venture; it is a symbol of Nigerian resilience and industrial ambition. If managed correctly, it could be the foundation for a new era of prosperity, powering the nation’s growth and providing the energy security that has eluded the country since independence.`,
    views: '150k',
    isBreaking: true
  },
  {
    id: 't-2',
    title: 'AGI and the Global South: Bridging the Digital Chasm',
    category: 'International',
    author: 'Sarah Jenkins',
    date: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'The race toward Artificial General Intelligence (AGI) is accelerating, but concerns grow over the potential exclusion of developing nations.',
    content: `The tech world is currently buzzing with the latest advancements from Silicon Valley, where major labs claim to be on the cusp of Artificial General Intelligence. This technology, capable of matching or exceeding human intellect across a broad range of tasks, promises to revolutionize medicine, engineering, and climate science.

However, a significant worry is emerging among international policy makers regarding the 'AI Divide.' While the West and China pour billions into compute power and talent acquisition, many nations in the Global South find themselves relegated to being data providers or mere consumers of finished models.

In Nigeria and other emerging economies, the challenge is two-fold: infrastructure and data sovereignty. Without consistent power and high-speed internet, the benefits of real-time AI integration remain a distant dream for rural communities. Furthermore, many of the world’s leading models are trained on Western datasets, often overlooking the linguistic and cultural nuances of African societies.

There is a growing movement to develop localized AI solutions. Experts argue that for AI to be truly beneficial, it must be 'African-centric,' trained on local dialects and tailored to solve regional challenges like agricultural optimization and decentralized finance.

On the ethical front, global regulation is lagging behind innovation. The UN is currently debating frameworks to ensure that AI development remains transparent and accountable. There is a fear that without global cooperation, AI could be used to widen the economic gap rather than close it.

Labor markets are also in the crosshairs. While AI can automate mundane tasks, there is a legitimate concern about job displacement in service sectors that many developing nations rely on. The focus must shift toward 'upskilling' and integrating AI as a tool for human enhancement.

The future of AGI will be a test of global solidarity. Will this technology be the ultimate equalizer, providing world-class education and healthcare to the farthest corners of the earth, or will it be the ultimate gatekeeper, solidifying the dominance of a few tech giants? The answer lies in the policies we write today.`,
    views: '89k'
  },
  {
    id: 't-3',
    title: 'The 2027 Realignment: Opposition Parties Forge New Coalition',
    category: 'Politics',
    author: 'Chijioke Nwosu',
    date: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1540910419892-f7e722a49266?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'In a surprise move that has shaken the political landscape, major opposition figures have met in Abuja to discuss a unified front.',
    content: `With the next general election still years away, the political drums are already beating a familiar rhythm of realignment. Yesterday’s high-profile meeting in Abuja between key figures from the PDP, LP, and NNPP has sent shockwaves through the ruling APC’s camp, signaling an early start to the 2027 campaign.

The meeting, reportedly lasting over six hours, focused on the potential for a 'Grand Opposition Alliance.' The goal is to avoid the vote-splitting that many believe led to the opposition’s collective defeat in 2023. By merging their grassroots structures, they hope to present a singular, formidable alternative to the incumbent administration.

However, the path to unity is fraught with ego and regional interests. Each party leader carries their own set of core supporters and ideologies that may not easily mesh. The question of who would head such a ticket is already the subject of intense speculation and potential friction.

Public reaction has been mixed. Some see it as a desperate move by career politicians to regain power, while others view it as a necessary consolidation to ensure a truly competitive democracy. The Nigerian youth, a pivotal demographic, remain skeptical, demanding concrete policy proposals over mere political arithmetic.

The ruling party has dismissed the move as a 'gathering of failed interests,' asserting that their focus remains on governance and delivering on their campaign promises. Behind closed doors, however, strategists are likely analyzing how a unified opposition could impact their strongholds in the North and Southwest.

Electoral reform remains a central theme of these discussions. The opposition is calling for further digitization of the voting process and more transparency in result collation. They argue that without a level playing field, any coalition—no matter how large—will struggle to overcome the advantages of incumbency.

As the months progress, the strength of this newfound unity will be tested by local government elections and internal party conventions. Whether this coalition can survive the heat of Nigerian politics remains to be seen, but for now, the 2027 race has officially begun.`,
    views: '112k'
  },
  {
    id: 't-4',
    title: 'Climate Change and the Sahel: A Crisis of Survival',
    category: 'International',
    author: 'Elena Petrova',
    date: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'As desertification accelerates in the Sahel region, the global community faces an unprecedented humanitarian challenge.',
    content: `The Sahel region, a vast belt stretching across Africa, is currently on the frontlines of the global climate crisis. Rising temperatures and erratic rainfall patterns are causing the Sahara Desert to creep southward at an alarming rate, swallowing arable land and displacing millions of farmers and herders.

This environmental degradation is directly linked to the increasing frequency of conflict in the region. As resources like water and grazing land become scarce, traditional tensions between communities are being pushed to the breaking point. The loss of livelihoods also provides fertile ground for extremist groups to recruit disillusioned youth.

The international response has been characterized by grand promises but inconsistent implementation. Initiatives like the 'Great Green Wall'—a project to plant a barrier of trees across the continent—have faced significant funding and logistical hurdles. While some progress has been made, the scale of the challenge far outpaces current efforts.

Inland nations like Niger and Chad are particularly vulnerable. Without a sea coast, their economies are heavily dependent on agriculture, which is increasingly becoming a gamble. The resulting migration toward coastal cities like Lagos and Accra is putting immense pressure on urban infrastructure.

Technological solutions, such as drought-resistant crops and advanced irrigation systems, offer a glimpse of hope. However, the cost of implementing these at scale is prohibitive for most Sahelian governments. There is a strong call for 'Climate Justice,' demanding that industrialized nations pay for the damage caused by their historical carbon emissions.

Global security experts warn that the Sahel crisis cannot be contained within Africa. The displacement of people and the rise of instability have direct implications for Mediterranean migration routes and global security. Solving the Sahel’s problems is, in essence, solving a global problem.

The upcoming COP summit will be a crucial moment for the region. Sahelian leaders are preparing to present a unified voice, demanding concrete financial commitments and technology transfers. The world can no longer afford to look away from a crisis that is fundamentally about the right to survive on a warming planet.`,
    views: '65k'
  },
  {
    id: 't-5',
    title: 'The Afrobeats Diplomacy: Nigeria’s Soft Power Surge',
    category: 'Entertainment',
    author: 'Toluwalashe Adeyemi',
    date: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'From Burna Boy to Tems, Nigerian artists are doing more for the country’s image than any diplomatic mission could.',
    content: `Walk into a club in London, a cafe in Paris, or a gym in New York, and you are almost guaranteed to hear the infectious rhythms of Afrobeats. Nigeria's music industry has transformed into a global juggernaut, transcending borders and languages to become one of the most significant cultural movements of the 21st century.

This isn't just about entertainment; it’s about 'Soft Power.' For decades, Nigeria’s international reputation was often overshadowed by stories of corruption and instability. Today, the world sees a different Nigeria—one that is vibrant, creative, and trend-setting. Our artists are our most effective ambassadors.

The economic impact is equally impressive. The influx of foreign investment from major record labels like Sony, Warner, and Universal has professionalized the local industry. This has created a massive ecosystem of producers, managers, stylists, and digital marketers, providing high-value jobs for thousands of young Nigerians.

Social media platforms like TikTok have played a crucial role in this explosion. Dance challenges and viral clips have allowed songs to travel from a studio in Ogba to a global audience in a matter of hours. The democratization of music distribution has removed the traditional gatekeepers of the global music industry.

However, challenges remain in the domestic market. Copyright enforcement and royalty collection systems are still in their infancy, meaning many artists don't see the full financial benefit of their work. Furthermore, the high cost of data and electricity makes streaming a luxury for many Nigerians at home.

There is also a conversation about 'cultural appropriation' versus 'cultural appreciation.' As global stars like Beyonce and Justin Bieber collaborate with Nigerian artists, there is a fine line between elevating the genre and diluting its essence for Western consumption.

Despite these hurdles, the momentum of Afrobeats shows no sign of slowing down. It has paved the way for other creative sectors, like Nollywood and Nigerian fashion, to seek their own global spotlights. Afrobeats has given Nigerians a reason to be proud and the world a reason to listen.`,
    views: '210k'
  },
  {
    id: 't-6',
    title: 'Federal Reserve Policy: The Ripple Effect on the Naira',
    category: 'Business',
    author: 'Dr. Michael Chu',
    date: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'How interest rate decisions in Washington D.C. are dictating the cost of living in Lagos and Kano.',
    content: `In our interconnected global economy, the decisions made by the US Federal Reserve have consequences that reach far beyond American borders. As the Fed battles inflation with higher interest rates, the US Dollar has strengthened significantly against almost every major currency, including the Nigerian Naira.

For an import-dependent economy like Nigeria, a strong dollar is a double-edged sword. While it attracts foreign investors seeking higher yields on US bonds, it makes the cost of importing essential goods—from machinery to food items—prohibitively expensive for local businesses.

This 'imported inflation' is a primary driver of the rising cost of living in Nigeria. As businesses pay more for foreign exchange, they inevitably pass those costs down to the consumer. The price of bread, fuel, and electronics are all, in some way, tied to the Fed’s interest rate trajectory.

The Central Bank of Nigeria (CBN) is left with difficult choices. To defend the Naira, they often have to raise domestic interest rates, which can stifle local borrowing and economic growth. It is a delicate balancing act between controlling inflation and encouraging industrialization.

Global market analysts suggest that the period of 'cheap money' is over. Emerging markets must now compete for a shrinking pool of global capital. This puts pressure on the Nigerian government to implement structural reforms that make the country more attractive to long-term direct investment.

There is also the issue of external debt. Much of Nigeria’s national debt is denominated in dollars. As the dollar strengthens and interest rates rise, the cost of servicing that debt increases, leaving less money in the national budget for education, healthcare, and infrastructure.

The takeaway for Nigerian businesses is clear: volatility is the new normal. Diversifying revenue streams and reducing reliance on imports are no longer just good strategies—they are essential for survival. Until the global economic cycle shifts again, the Naira will remain at the mercy of decisions made thousands of miles away.`,
    views: '74k'
  },
  {
    id: 't-7',
    title: 'Digital Literacy: The New Frontier in Northern Nigeria',
    category: 'Education',
    author: 'Fatima Mohammed',
    date: '12 hours ago',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'State governments and NGOs are partnering to bring coding and data science to a new generation of students in the North.',
    content: `For too long, the narrative around education in Northern Nigeria has been one of deficit and challenge. However, a quiet revolution is taking place in states like Kaduna, Kano, and Gombe, as a wave of digital literacy initiatives begins to take root in primary and secondary schools.

The goal is simple: to equip young Nigerians with the skills needed for the 24th-century workforce. In a world where 'code is the new literacy,' being able to navigate a computer is as important as reading and writing. These programs are designed to bridge the gap between traditional learning and the global digital economy.

The challenges are significant. Many schools still lack basic computer labs, and the erratic power supply makes consistent practice difficult. However, the use of solar-powered 'tech hubs' and mobile learning units is proving to be a game-changer for rural communities.

Perhaps most encouraging is the focus on girl-child education. Many of these tech programs are specifically targeting female students, breaking down cultural barriers and proving that girls can excel in STEM fields. This is crucial for the long-term socio-economic development of the region.

Local tech startups are also getting involved, providing mentorship and internships for the best students. This creates a clear pipeline from the classroom to the boardroom, showing students that a career in technology is a viable and exciting path.

The impact goes beyond just technical skills. Learning to code fosters logical thinking, problem-solving, and creativity. It gives students the confidence to think globally while solving local problems. It's about empowering them to be creators, not just consumers, of technology.

As these initiatives scale, the potential for a 'Tech Boom' in the North becomes more real. By investing in the human capital of today, the region is laying the groundwork for the industries of tomorrow. It is a story of hope and transformation that deserves national attention.`,
    views: '42k'
  },
  {
    id: 't-8',
    title: 'The Malaria Vaccine: A Historic Breakthrough for Africa',
    category: 'International',
    author: 'Dr. Elizabeth Mensah',
    date: '1 day ago',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'After decades of research, the widespread rollout of the R21/Matrix-M vaccine marks a turning point in the fight against a deadly disease.',
    content: `Malaria has been a shadow over the African continent for centuries, claiming hundreds of thousands of lives every year, particularly among children under five. For decades, a vaccine seemed like an impossible dream due to the complexity of the malaria parasite. That dream has finally become a reality.

The R21/Matrix-M vaccine, developed with significant involvement from African scientists and institutions, is currently being rolled out in several countries, including Nigeria. Early results from clinical trials showed a high level of efficacy, promising to drastically reduce both infections and hospitalizations.

The rollout is a massive logistical undertaking. It requires cold-chain infrastructure to keep the vaccines at the correct temperature, and a robust distribution network to reach remote villages. Governments are working closely with international partners like Gavi and the WHO to ensure no one is left behind.

Public perception is another critical factor. Health workers are working overtime to combat misinformation and explain the benefits of the vaccine to skeptical parents. Community leaders and religious figures are being engaged to help build trust and encourage participation in the immunization programs.

There is also a push for local manufacturing. Several African nations are seeking the technology and funding to produce the vaccine on the continent. This would not only reduce costs but also ensure a more stable supply chain during future health crises.

While the vaccine is a monumental achievement, health experts warn against complacency. Bed nets, indoor spraying, and effective treatments remain essential tools in the fight against malaria. The vaccine is a powerful new addition to our toolkit, not a replacement for existing methods.

The long-term economic impact of a malaria-free Africa cannot be overstated. The disease costs the continent billions of dollars in lost productivity and healthcare expenses. By eliminating malaria, we are not just saving lives; we are unlocking the economic potential of an entire generation.`,
    views: '128k'
  },
  {
    id: 't-9',
    title: 'Lagos Rail: Reimagining the Urban Commute',
    category: 'Metro',
    author: 'Segun Amusan',
    date: '2 days ago',
    image: 'https://images.unsplash.com/photo-1474487056233-5220ea1a2117?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'The Blue and Red lines are beginning to change the face of transportation in Africa’s largest metropolis.',
    content: `Lagos is famous for many things, but its traffic congestion—the legendary 'go-slow'—is perhaps its most notorious feature. For millions of residents, the daily commute is an grueling battle against time, heat, and gridlock. The newly commissioned Lagos Rail Mass Transit system is finally offering a light at the end of the tunnel.

The Blue Line, running from Marina to Mile 2, and the Red Line, stretching from Agbado to Oyingbo, represent the first modern metro system in West Africa. By moving thousands of people off the roads and onto the rails, the government hopes to significantly reduce travel times and carbon emissions.

The experience of riding the train is a world away from the chaotic 'danfo' buses. With air-conditioning, security personnel, and a structured timetable, the rail system is bringing a level of dignity and efficiency to public transport that many Lagosians thought was impossible.

The economic impact is already visible around the station hubs. Property values in areas like Agbado and Ikeja have seen a sharp increase, as residents look for homes with easy access to the rail line. Small businesses are also cropping up near the stations, creating new micro-economies.

However, maintenance remains the biggest concern for skeptics. Historically, large-scale infrastructure projects in Nigeria have suffered from neglect. The state government has assured the public that they have partnered with international management firms to ensure the trains and tracks are kept in top condition.

Safety is also a priority. The integration of the 'Cowry Card'—a unified payment system for trains, buses, and ferries—is helping to streamline the boarding process and reduce the handling of cash. This digitized system also provides valuable data for future transport planning.

The Lagos Rail is not just a transport project; it’s a social project. It’s about giving people back their time—time that can be spent with family, in education, or being productive. As the system expands to other parts of the city, the dream of a truly 'Smart Lagos' is slowly becoming a reality.`,
    views: '95k'
  },
  {
    id: 't-10',
    title: 'Mars Mission 2025: A New Chapter in International Space Exploration',
    category: 'International',
    author: 'Dr. Alistair Vance',
    date: '3 days ago',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000',
    excerpt: 'As NASA, ESA, and private entities prepare for the next window to the Red Planet, the focus shifts to human endurance and deep-space ethics.',
    content: `The quest to land humans on Mars is no longer the stuff of science fiction. It is now a matter of precise engineering and international diplomacy. As we approach the 2025 launch window, space agencies around the world are finalizing their plans for what could be the most significant journey in human history.

The challenges are staggering. A round-trip to Mars takes nearly two years, exposing astronauts to prolonged radiation and the psychological stress of isolation. Designing life-support systems that can function autonomously for such a long period is the primary focus of current research.

This isn't just a race between nations; it's a new era of public-private partnerships. While NASA provides the strategic framework and deep-space expertise, private companies like SpaceX and Blue Origin are driving down costs with reusable rockets and innovative manufacturing.

There is also a growing debate about the 'Colonization of Space.' Ethicists are questioning the right of humans to occupy another planet and the potential for contaminating the Martian environment with Earth-born microbes. The search for past or present life on Mars remains a delicate scientific mission.

International cooperation is essential. The high cost and complexity of a Mars mission mean that no single nation can do it alone. The International Space Station (ISS) has shown that we can work together in space even when we disagree on Earth; the Mars mission will be the ultimate test of this spirit.

The technology developed for Mars has direct benefits for Earth. Advancements in water recycling, high-density batteries, and remote medicine will find applications in solving our own planet’s most pressing problems. Space exploration is, in many ways, an investment in our future here at home.

As the world watches the countdown to the 2025 window, there is a sense of collective awe. We are a species of explorers, and the Red Planet is the next horizon. Whether we succeed or fail, the attempt itself is a testament to human curiosity and our refusal to be bound by the limits of our own world.`,
    views: '167k'
  }
];

const INITIAL_COMMENTS: Record<string, Comment[]> = {
  't-1': [
    { id: 'c1', author: 'Tunde B.', email: 'tunde@example.com', content: 'This is great news for the ecosystem!', date: '1 hour ago', articleId: 't-1' },
    { id: 'c2', author: 'Sarah K.', email: 'sarah@example.com', content: 'Lekki is truly changing.', date: '30 mins ago', articleId: 't-1' }
  ]
};

// --- Utility Functions ---

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Components ---

const Header: React.FC<{ 
  onNavigate: (view: string, id?: string) => void; 
  toggleTheme: () => void; 
  isDark: boolean;
  activeAd?: Advertisement;
}> = ({ onNavigate, toggleTheme, isDark, activeAd }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      {activeAd && (
        <div className="bg-gray-100 dark:bg-gray-800 w-full overflow-hidden h-24 md:h-32 relative flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <a href={activeAd.adUrl || '#'} target={activeAd.adUrl ? "_blank" : "_self"} rel="noreferrer" className="w-full h-full">
             {activeAd.adImage ? (
               <img src={activeAd.adImage} alt="Advertisement" className="w-full h-full object-cover" />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-400 text-sm">Premium Ad Area</div>
             )}
          </a>
          <span className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">Sponsored</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-naija rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Globe className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col justify-center overflow-visible">
              <h1 className="font-sans text-base md:text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                The People’s Platform
              </h1>
              <p className="text-[9px] md:text-[10px] text-naija font-bold uppercase tracking-widest mt-1 hidden xs:block">Voice of the Nation</p>
            </div>
          </div>
        </div>
  
        <div className="flex items-center gap-1 md:gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          
          <div className="hidden lg:flex items-center gap-6 mr-4">
            <button onClick={() => onNavigate('advertise')} className="text-sm font-semibold hover:text-naija transition-colors">Advertise</button>
          </div>
          
          <button 
            onClick={() => onNavigate('submit')}
            className="hidden sm:flex items-center gap-2 bg-naija hover:bg-green-700 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg hover:shadow-green-500/20 active:scale-95"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden md:inline">Submit Story</span>
            <span className="md:hidden">Submit</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
      
      <div className={`lg:hidden fixed left-0 top-0 h-screen w-3/4 max-w-xs z-50 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-naija rounded-full flex items-center justify-center text-white"><Globe className="w-6 h-6" /></div>
              <span className="font-bold dark:text-white">Menu</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)}><CloseIcon className="w-6 h-6 text-gray-400" /></button>
          </div>
          <nav className="space-y-4">
            <button 
              onClick={() => handleMobileNav('home')} 
              className="w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-4 hover:bg-naija/10 hover:text-naija dark:text-gray-200 transition-all"
            >
              <Home className="w-5 h-5" /> Home
            </button>
            <button 
              onClick={() => handleMobileNav('advertise')} 
              className="w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-4 hover:bg-naija/10 hover:text-naija dark:text-gray-200 transition-all"
            >
              <Briefcase className="w-5 h-5" /> Advertise
            </button>
            <button 
              onClick={() => handleMobileNav('submit')} 
              className="w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-4 bg-naija text-white shadow-lg active:scale-95 transition-all"
            >
              <PenTool className="w-5 h-5" /> Submit Story
            </button>
          </nav>
          
          <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-700">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Connect</p>
             <div className="flex gap-4">
                <div className="text-gray-400 hover:text-naija cursor-pointer"><SocialIcons.Facebook /></div>
                <div className="text-gray-400 hover:text-naija cursor-pointer"><SocialIcons.Twitter /></div>
                <div className="text-gray-400 hover:text-naija cursor-pointer"><SocialIcons.Instagram /></div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({ article, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-gray-700"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="bg-naija text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md bg-opacity-90">
          {article.category}
        </span>
        {article.isBreaking && (
          <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> Breaking
          </span>
        )}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mb-3 uppercase font-bold tracking-widest">
        <span className="text-naija">{article.author}</span>
        <span>•</span>
        <span>{article.date}</span>
      </div>
      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-naija transition-colors">
        {article.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> {article.views} reads
        </span>
        <span className="text-naija text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Read More <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </div>
);

const SponsoredArticleCard: React.FC<{ ad: Advertisement }> = ({ ad }) => (
  <div className="group bg-green-50/50 dark:bg-green-900/10 rounded-2xl overflow-hidden shadow-sm border-2 border-naija/20">
    <div className="relative h-56 overflow-hidden">
      <img 
        src={ad.adImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'} 
        alt={ad.clientName}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
          Sponsored Story
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
        {ad.adHeadline || `In Partnership with ${ad.clientName}`}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5">
        {ad.adContent || "Exclusive insights and stories from our corporate partners."}
      </p>
      {ad.adUrl && (
         <a 
          href={ad.adUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-naija hover:underline"
        >
          Explore More <ChevronRight className="w-4 h-4" />
        </a>
      )}
    </div>
  </div>
);

const ArticleReader: React.FC<{ 
  article: Article; 
  onBack: () => void;
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onDeleteComment: (id: string) => void;
  isAdmin: boolean;
  activeAd?: Advertisement;
}> = ({ article, onBack, comments, onAddComment, onDeleteComment, isAdmin, activeAd }) => {
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim() || !commentEmail.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentName,
      email: commentEmail,
      content: commentContent,
      date: 'Just now',
      articleId: article.id
    };

    onAddComment(newComment);
    setCommentName('');
    setCommentEmail('');
    setCommentContent('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-naija mb-8 transition-colors group"
      >
        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Newsroom
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="h-72 md:h-[30rem] w-full relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
            <span className="bg-naija text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6 inline-block w-fit shadow-2xl">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-gray-100 dark:border-gray-700 mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <User className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{article.author}</p>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{article.date} • {article.views} reads</p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${copied ? 'bg-naija text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <LinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                {copied ? 'Link Copied' : 'Share'}
              </button>
              <button className="p-2 md:p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-naija rounded-xl transition-colors">
                <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium italic border-l-4 border-naija pl-4 md:pl-6">
              {article.excerpt}
            </p>
            <div className="text-gray-800 dark:text-gray-200 leading-loose space-y-6 text-base md:text-lg font-serif">
              {article.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Targeted Ad Placement */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 md:p-10 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">Partner Content</p>
          {activeAd ? (
            <a href={activeAd.adUrl || '#'} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-2xl shadow-lg">
               <img src={activeAd.adImage} alt={activeAd.clientName} className="w-full h-auto max-h-[300px] object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-2 right-2 bg-black/60 text-white text-[8px] px-2 py-1 rounded backdrop-blur-sm">PROMOTED</div>
            </a>
          ) : (
            <div className="h-40 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-naija cursor-pointer group" onClick={() => window.location.hash = '#/advertise'}>
              <div className="text-center px-4">
                <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-naija group-hover:scale-110 transition-all" />
                <span className="text-gray-400 font-bold text-sm">Targeted Advertising Space Available</span>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-6 md:p-12 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8 md:mb-10 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-naija" />
            Voices from the Nation ({comments.length})
          </h3>

          <form onSubmit={handleSubmitComment} className="mb-10 md:mb-12 bg-gray-50 dark:bg-gray-900/50 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-naija focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Tunde Bello"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-naija focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Share Your Thoughts</label>
              <textarea
                required
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-naija focus:border-transparent outline-none transition-all h-32 resize-none"
                placeholder="What is your take on this?"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-naija hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20 active:scale-95"
            >
              <Send className="w-4 h-4" /> Post Your Voice
            </button>
          </form>

          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-naija/10 rounded-xl flex items-center justify-center text-naija font-bold text-xs shrink-0">
                        {comment.author.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{comment.author}</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{comment.date}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

const SubmitNewsPage: React.FC<{ 
  onBack: () => void; 
  onSubmit: (article: Article) => void;
}> = ({ onBack, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Metro');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{title?: string; summary?: string} | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await readFileAsDataURL(file);
        setImagePreview(base64);
      } catch (err) { console.error(err); }
    }
  };

  const handleAnalyze = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Analyze this news article content and provide a catchy headline and a one-sentence summary. 
      Format as JSON: {"title": "...", "summary": "..."}
      Content: ${content.substring(0, 1000)}`;
      const result = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
      const json = JSON.parse(result.text.replace(/```json|```/g, ''));
      setAiSuggestions(json);
    } catch (error) { console.error(error); } finally { setIsAnalyzing(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(),
      title: aiSuggestions?.title || title,
      category,
      author: 'Citizen Reporter',
      date: 'Just now',
      image: imagePreview || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000',
      excerpt: aiSuggestions?.summary || content.substring(0, 100) + '...',
      content,
      views: '0'
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <button onClick={onBack} className="mb-6 md:mb-8 flex items-center gap-2 text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-naija">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Home
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Submit a Story</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8 md:mb-10">Community Journalism Portal</p>
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white font-bold outline-none">
              <option>Government</option><option>International</option><option>Education</option><option>Metro</option><option>Lifestyle</option><option>Politics</option><option>Business</option><option>Technology</option><option>Sports</option><option>Entertainment</option><option>Editorials</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Media</label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 text-center hover:border-naija transition-all cursor-pointer relative bg-gray-50 dark:bg-gray-900/50">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {imagePreview ? <img src={imagePreview} className="h-40 md:h-48 mx-auto object-cover rounded-xl shadow-lg" /> : <div className="text-gray-400"><ImageIcon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3" /><p className="text-[10px] font-bold uppercase tracking-widest">Upload Eye-Witness Photo</p></div>}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">The Details</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white h-48 focus:ring-2 focus:ring-naija outline-none" placeholder="What happened? Where and when?" required />
            <button type="button" onClick={handleAnalyze} disabled={!content || isAnalyzing} className="mt-4 text-[10px] font-bold text-naija uppercase tracking-widest flex items-center gap-2 hover:underline disabled:opacity-50">
              {isAnalyzing ? 'Analyzing with AI...' : '✨ Optimize Headline with AI'}
            </button>
          </div>
          {aiSuggestions && (
            <div className="bg-naija/10 p-5 md:p-6 rounded-2xl border border-naija/20">
              <p className="text-[10px] font-bold text-naija uppercase mb-3">AI Recommendation</p>
              <p className="font-bold text-gray-900 dark:text-white mb-1">{aiSuggestions.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{aiSuggestions.summary}</p>
              <button type="button" onClick={() => setTitle(aiSuggestions.title || '')} className="mt-4 text-[10px] font-bold bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Use Recommended Title</button>
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Story Headline</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-naija outline-none" placeholder="Enter headline" required />
          </div>
          <button type="submit" className="w-full bg-naija hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-green-500/20 active:scale-95 uppercase tracking-widest text-sm">Submit to Newsroom</button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [route, setRoute] = useState({ view: 'home', id: '' });
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync state with URL Hash for back/forward support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === '/' || hash === 'home') {
        setRoute({ view: 'home', id: '' });
      } else if (hash.startsWith('/article/')) {
        const id = hash.split('/article/')[1];
        setRoute({ view: 'article', id });
      } else if (hash.startsWith('/')) {
        setRoute({ view: hash.substring(1), id: '' });
      } else {
        setRoute({ view: hash, id: '' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial route check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: string, id?: string) => {
    const newHash = id ? `/article/${id}` : `/${view}`;
    window.location.hash = newHash;
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const activeArticle = useMemo(() => {
    if (route.view === 'article' && route.id) {
      return articles.find(a => a.id === route.id) || null;
    }
    return null;
  }, [route, articles]);

  const displayFeed = useMemo(() => {
    let filtered = selectedCategory === 'All' ? articles : articles.filter(a => a.category === selectedCategory);
    const activeAds = ads.filter(a => a.status === 'Active' && a.plan === 'Sponsored Article');
    const result: any[] = [...filtered];
    activeAds.forEach((ad, i) => {
      const idx = (i + 1) * 3;
      if (idx < result.length) result.splice(idx, 0, { isAd: true, data: ad, id: `ad-${ad.id}` });
    });
    return result;
  }, [articles, selectedCategory, ads]);

  const headerAd = ads.find(a => a.status === 'Active' && a.plan === 'Header Leaderboard');
  const sidebarAd = ads.find(a => a.status === 'Active' && a.plan === 'Sidebar Banner');

  // ... inside your render function
  if (route.view === 'admin') {
    return (
      <AdminDashboard 
        articles={articles} 
        pendingArticles={pendingArticles} 
        ads={ads}
        onPublish={async (a) => { /* ... */ }} 
        onDelete={async (id) => { /* ... */ }}
        onApproveSubmission={async (a) => { /* ... */ }}
        onRejectSubmission={async (id) => { /* ... */ }}
        onApproveAd={async (id) => { /* ... */ }}
        onRejectAd={async (id) => { /* ... */ }}
        onLogout={() => { setIsAdmin(false); navigate('home'); }}
      />
    ); // <--- Ensure this semicolon and closing paren exist!
  } // <--- Ensure this closing brace exists!

  if (route.view === 'login') {
    return (
      <StaffLoginPage 
        onLogin={() => { setIsAdmin(true); navigate('admin'); }} 
        onBack={() => navigate('home')} 
      />
    );
  }

  if (route.view === 'login') {
    return <StaffLoginPage onLogin={() => { setIsAdmin(true); navigate('admin'); }} onBack={() => navigate('home')} />;
  }

  // Categories list stays manageable
  const allCategories = ['All', 'Government', 'International', 'Education', 'Metro', 'Lifestyle', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Editorials'];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <Header onNavigate={navigate} toggleTheme={toggleTheme} isDark={isDark} activeAd={headerAd} />
      
      <main className="flex-grow">
        {route.view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {/* Category Navigation: Wrap on mobile, single line on desktop with reduced fonts/spacing */}
            <div className="flex flex-wrap md:flex-nowrap mb-6 md:mb-8 gap-2 md:gap-0.5 lg:gap-2.5 border-b border-gray-100 dark:border-gray-700 pb-4 overflow-x-visible">
               {allCategories.map(cat => (
                 <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`shrink-0 px-2.5 md:px-1.5 lg:px-2.5 py-1.5 md:py-1 rounded-full text-[10px] md:text-[8px] lg:text-[10px] font-bold uppercase tracking-tighter md:tracking-normal lg:tracking-widest whitespace-nowrap transition-all shadow-sm ${selectedCategory === cat ? 'bg-naija text-white shadow-green-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-naija border border-gray-100 dark:border-gray-700'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
            
            {displayFeed.length > 0 && selectedCategory === 'All' && (
              <div className="mb-8 grid lg:grid-cols-3 gap-8 md:gap-10 items-stretch">
                {/* Main Hero Article */}
                <div className="lg:col-span-2 cursor-pointer group" onClick={() => navigate('article', displayFeed[0].id)}>
                  <div className="relative h-80 md:h-full min-h-[30rem] lg:min-h-[38rem] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                    <img src={displayFeed[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={displayFeed[0].title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
                      <span className="bg-naija text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block w-fit shadow-xl">{displayFeed[0].category}</span>
                      <h2 className="text-xl md:text-3xl lg:text-5xl font-serif font-bold text-white mb-4 lg:mb-6 leading-tight">{displayFeed[0].title}</h2>
                      <p className="text-gray-200 line-clamp-2 text-sm md:text-lg max-w-2xl font-medium hidden sm:block">{displayFeed[0].excerpt}</p>
                    </div>
                  </div>
                </div>

                {/* Trending Sidebar */}
                <div className="space-y-6 md:space-y-8 flex flex-col">
                  <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3 text-base md:text-lg"><TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-naija" /> Pulsing Now</h3>
                    <div className="space-y-6 md:space-y-8">
                      {articles.slice(1, 4).map((a, i) => (
                        <div key={a.id} className="flex gap-3 md:gap-4 cursor-pointer group" onClick={() => navigate('article', a.id)}>
                          <span className="text-2xl md:text-3xl font-serif font-bold text-gray-100 dark:text-gray-700 group-hover:text-naija transition-colors shrink-0">0{i+1}</span>
                          <div>
                            <h4 className="font-serif font-bold text-gray-900 dark:text-white leading-tight group-hover:text-naija transition-colors line-clamp-2 text-sm md:text-base">{a.title}</h4>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 mt-1 md:mt-2 block uppercase tracking-widest">{a.views} active readers</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Home Page Sidebar Advert Space */}
                  <div className="p-1 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Partner Content</p>
                    {sidebarAd ? (
                      <a href={sidebarAd.adUrl || '#'} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-[1.8rem] md:rounded-[2rem] shadow-xl">
                        <img src={sidebarAd.adImage} alt={sidebarAd.clientName} className="w-full h-auto max-h-[400px] object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-[8px] px-2 py-1 rounded backdrop-blur-sm">PROMOTED</div>
                      </a>
                    ) : (
                      <div 
                        onClick={() => navigate('advertise')}
                        className="h-28 md:h-32 bg-white dark:bg-gray-800 rounded-[1.8rem] md:rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-naija cursor-pointer group"
                      >
                        <div className="text-center px-4 md:px-6">
                          <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-gray-300 mx-auto mb-1 group-hover:text-naija group-hover:scale-110 transition-all" />
                          <span className="text-gray-400 font-bold text-[10px] md:text-xs">Book This Slot</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-naija p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                     <h4 className="text-xl font-serif font-bold mb-1">Witness News?</h4>
                     <p className="text-xs text-green-50/80 mb-4 leading-relaxed">Help us tell the stories that matter.</p>
                     <button onClick={() => navigate('submit')} className="w-full py-2 bg-white text-naija rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-green-50 transition-colors">Submit a Report</button>
                  </div>
                </div>
              </div>
            )}

            {/* Latest From Field Section */}
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8 md:mb-10 flex items-center gap-3 border-l-4 border-naija pl-4 md:pl-6">Latest from the Field</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {displayFeed.slice(selectedCategory === 'All' ? 4 : 0).map((item: any) => item.isAd ? <SponsoredArticleCard key={item.id} ad={item.data} /> : <ArticleCard key={item.id} article={item} onClick={() => navigate('article', item.id)} />)}
            </div>
          </div>
        )}

        {route.view === 'article' && activeArticle && (
          <ArticleReader 
            article={activeArticle} 
            onBack={() => navigate('home')}
            comments={comments[activeArticle.id] || []}
            onAddComment={c => setComments(p => ({ ...p, [c.articleId]: [c, ...(p[c.articleId] || [])] }))}
            onDeleteComment={id => setComments(p => ({ ...p, [activeArticle.id]: p[activeArticle.id].filter(c => c.id !== id) }))}
            isAdmin={isAdmin}
            activeAd={sidebarAd}
          />
        )}

        {route.view === 'submit' && <SubmitNewsPage onBack={() => navigate('home')} onSubmit={a => { setPendingArticles([a, ...pendingArticles]); alert("Your story has been submitted for editorial review. Thank you for being a part of the platform!"); navigate('home'); }} />}
        {route.view === 'advertise' && <AdvertisePage onBack={() => navigate('home')} onSubmitAd={a => setAds([a, ...ads])} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
};

const AdvertisePage: React.FC<{ 
  onBack: () => void;
  onSubmitAd: (ad: Advertisement) => void;
}> = ({ onBack, onSubmitAd }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Advertisement['plan'] | null>(null);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [adImagePreview, setAdImagePreview] = useState<string>('');
  const [adContent, setAdContent] = useState('');
  const [adHeadline, setAdHeadline] = useState('');

  const plans = [
    { name: 'Sidebar Banner' as const, price: 50000, features: ['Front Page Sidebar', 'Internal Article Slot', 'Weekly Rotation', 'Brand Analytics'] },
    { name: 'Sponsored Article' as const, price: 150000, features: ['Full Feature Story', 'Native Integration', 'Social Media Push', 'Permanent Indexing'] },
    { name: 'Header Leaderboard' as const, price: 350000, features: ['Ultimate Branding', 'Global Header Sticky', 'Monthly Duration', 'Desktop & Mobile'] },
  ];

  const handlePlanSelect = (planName: Advertisement['plan']) => {
    setSelectedPlan(planName);
    setShowPaymentModal(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await readFileAsDataURL(e.target.files[0]);
        setter(base64);
      } catch (err) { console.error(err); }
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !receiptPreview) return;

    const newAd: Advertisement = {
      id: Date.now().toString(),
      clientName,
      email,
      plan: selectedPlan,
      amount: plans.find(p => p.name === selectedPlan)?.price || 0,
      status: 'Pending',
      dateSubmitted: new Date().toLocaleDateString(),
      receiptImage: receiptPreview,
      adImage: adImagePreview,
      adContent: selectedPlan === 'Sponsored Article' ? adContent : undefined,
      adHeadline: selectedPlan === 'Sponsored Article' ? adHeadline : undefined,
    };

    onSubmitAd(newAd);
    setShowPaymentModal(false);
    alert("Payment submitted! Our marketing team will verify the transfer and activate your campaign within 6 hours.");
    onBack();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <button onClick={onBack} className="mb-8 md:mb-12 flex items-center gap-2 text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-naija">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Headlines
      </button>

      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">Drive Your Growth with the Nation</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg">Partner with the most trusted voice in Nigerian digital news. No subscriptions, just transparent community support.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white dark:bg-gray-800 rounded-[2.2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col hover:scale-[1.03] md:hover:scale-105 transition-all duration-500">
            <div className="p-8 md:p-10 bg-gray-50 dark:bg-gray-900/50 text-center border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white mb-3 md:mb-4">{plan.name}</h3>
              <p className="text-3xl md:text-4xl font-serif font-bold text-naija">₦{plan.price.toLocaleString()}</p>
            </div>
            <div className="p-8 md:p-10 flex-grow">
              <ul className="space-y-3 md:space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-naija shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 md:p-10 pt-0">
              <button 
                onClick={() => handlePlanSelect(plan.name)}
                className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-3 md:py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:opacity-90 shadow-lg active:scale-95 transition-all"
              >
                Select Campaign
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] max-w-2xl w-full p-6 md:p-10 relative my-auto border border-gray-100 dark:border-gray-700 shadow-2xl">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 transition-colors">
              <CloseIcon className="w-7 h-7 md:w-8 md:h-8" />
            </button>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 dark:text-white text-center">Finalize Advertisement</h3>
            <div className="bg-naija/10 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-naija/20 mb-6 md:mb-8 text-center">
              <p className="text-[10px] font-bold text-naija uppercase tracking-widest mb-3 md:mb-4">Secure Payment Details</p>
              <div className="flex flex-col items-center gap-2">
                 <div className="font-mono text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-widest">1025924586</div>
                 <div className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300">UBA Bank • Opinion Platform Ltd</div>
                 <p className="text-xs md:text-sm text-gray-500 mt-2">Amount to Transfer: <span className="font-bold text-naija">₦{plans.find(p => p.name === selectedPlan)?.price.toLocaleString()}</span></p>
              </div>
            </div>
            <form onSubmit={handleSubmitProof} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <input required type="text" placeholder="Brand / Client Name" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white font-medium outline-none text-sm" />
                <input required type="email" placeholder="Billing Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white font-medium outline-none text-sm" />
              </div>
              {selectedPlan === 'Sponsored Article' && (
                <>
                  <input required type="text" placeholder="Sponsored Headline" value={adHeadline} onChange={e => setAdHeadline(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white font-bold outline-none text-sm" />
                  <textarea required placeholder="Featured Content..." value={adContent} onChange={e => setAdContent(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white h-32 font-serif outline-none text-sm" />
                </>
              )}
              <div className="grid md:grid-cols-2 gap-6 border-t pt-6 md:pt-8 dark:border-gray-700">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">Campaign Visual</label>
                  <input required type="file" onChange={e => handleFileChange(e, setAdImagePreview)} className="w-full text-[10px] font-bold text-gray-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">Proof of Transfer</label>
                  <input required type="file" onChange={e => handleFileChange(e, setReceiptPreview)} className="w-full text-[10px] font-bold text-gray-500" />
                </div>
              </div>
              <button type="submit" className="w-full bg-naija text-white py-4 md:py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-sm hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-95 mt-4 md:mt-6">
                Submit Campaign for Activation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StaffLoginPage: React.FC<{ onLogin: () => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 dark:bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-white dark:text-gray-900 mx-auto mb-6 md:mb-8 shadow-xl"><Lock className="w-8 h-8 md:w-10 md:h-10" /></div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Editorial Access</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 md:mb-10">Restricted Staff Area</p>
        <form onSubmit={(e) => { e.preventDefault(); if(password === 'admin') onLogin(); else alert('Invalid Code'); }} className="space-y-4 md:space-y-6">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-naija outline-none text-center text-xl md:text-2xl tracking-[0.5em]" placeholder="••••" autoFocus />
          <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl uppercase tracking-widest text-[10px] md:text-xs shadow-lg active:scale-95 transition-all">Authenticate</button>
          <button type="button" onClick={onBack} className="w-full text-gray-400 text-[10px] font-bold uppercase tracking-widest py-2 hover:text-naija transition-colors">Return to Home</button>
        </form>
      </div>
    </div>
  );
};

const AdminComposeForm: React.FC<{ 
  initialData?: Article; 
  onSave: (a: Article) => void; 
  onCancel?: () => void 
}> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Metro');
  const [content, setContent] = useState(initialData?.content || '');
  const [image, setImage] = useState(initialData?.image || '');
  const categories = ['Government', 'International', 'Education', 'Metro', 'Lifestyle', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Editorials'];

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const b64 = await readFileAsDataURL(e.target.files[0]);
      setImage(b64);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !image) return alert("Please fill all required fields");
    onSave({
      id: initialData?.id || Date.now().toString(),
      title,
      category,
      author: initialData?.author || 'Editorial Desk',
      date: initialData?.date || 'Just now',
      image,
      excerpt: content.substring(0, 150) + '...',
      content,
      views: initialData?.views || '0',
      isBreaking: initialData?.isBreaking
    });
    if (!initialData) {
      setTitle('');
      setContent('');
      setImage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-naija/10 rounded-2xl"><Plus className="w-6 h-6 text-naija" /></div>
          <h2 className="text-2xl font-serif font-bold dark:text-white">{initialData ? 'Edit Article' : 'Compose New Editorial'}</h2>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="grid gap-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Headline</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white font-bold outline-none focus:ring-2 focus:ring-naija" placeholder="Enter the main title..." />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white font-bold outline-none">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Feature Image</label>
            <input type="file" onChange={handleImage} className="w-full text-xs text-gray-500" />
            {image && <img src={image} className="mt-4 h-24 rounded-lg shadow-sm object-cover" />}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Article Body</label>
          <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full p-6 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white h-96 font-serif leading-loose outline-none focus:ring-2 focus:ring-naija" placeholder="Tell the story..." />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-naija text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">
            {initialData ? 'Save Changes' : 'Publish to Live Feed'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-8 border border-gray-200 dark:border-gray-700 dark:text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

const AdminDashboard: React.FC<{
  articles: Article[];
  pendingArticles: Article[];
  ads: Advertisement[];
  onPublish: (article: Article) => void;
  onDelete: (id: string) => void;
  onUpdate: (article: Article) => void;
  onApproveSubmission: (article: Article) => void;
  onRejectSubmission: (id: string) => void;
  onApproveAd: (id: string) => void;
  onRejectAd: (id: string) => void;
  onLogout: () => void;
}> = ({ articles, pendingArticles, ads, onPublish, onDelete, onUpdate, onApproveSubmission, onRejectSubmission, onApproveAd, onRejectAd, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'pending' | 'compose' | 'ads'>('live');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleEditSave = (updated: Article) => {
    onUpdate(updated);
    setEditingArticle(null);
    alert("Article updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-md px-4 md:px-8 py-4 md:py-6 flex justify-between items-center sticky top-0 z-[60] border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 md:gap-3 text-gray-900 dark:text-white font-bold text-base md:text-xl shrink-0"><Shield className="w-6 h-6 md:w-8 md:h-8 text-naija" /><span className="hidden sm:inline">Editorial Control Center</span><span className="sm:hidden">Admin</span></div>
        <button onClick={onLogout} className="text-red-500 font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 md:px-4 md:py-2 border border-red-100 dark:border-red-900/30 rounded-xl hover:bg-red-50 transition-all">Sign Out</button>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        {!editingArticle ? (
          <>
            <div className="flex gap-2 md:gap-4 mb-6 md:mb-10 overflow-x-auto pb-4 scrollbar-hide">
              {['live', 'pending', 'ads', 'compose'].map((t: any) => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all whitespace-nowrap ${activeTab === t ? 'bg-naija text-white shadow-xl shadow-green-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'}`}>
                  {t} {t === 'live' ? `(${articles.length})` : t === 'pending' ? `(${pendingArticles.length})` : t === 'ads' ? `(${ads.filter(a => a.status === 'Pending').length})` : ''}
                </button>
              ))}
            </div>
            {activeTab === 'live' && (
              <div className="grid gap-4 md:gap-6">
                {articles.map(a => (
                  <div key={a.id} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:shadow-lg transition-all">
                    <div className="flex gap-4 md:gap-6 items-center overflow-hidden">
                      <img src={a.image} className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-xl md:rounded-2xl shadow-md shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-serif font-bold dark:text-white text-sm md:text-lg group-hover:text-naija transition-colors truncate">{a.title}</h3>
                        <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                           <span className="text-[9px] md:text-[10px] font-bold text-naija uppercase tracking-widest">{a.category}</span>
                           <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => setEditingArticle(a)}
                        className="text-naija hover:bg-green-50 dark:hover:bg-green-900/20 p-2 md:p-3 rounded-xl transition-all"
                      >
                        <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button 
                        onClick={() => onDelete(a.id)} 
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 md:p-3 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'pending' && (
              <div className="grid gap-6">
                {pendingArticles.map(a => (
                  <div key={a.id} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-serif font-bold text-xl md:text-2xl dark:text-white mb-4">{a.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed italic line-clamp-3">{a.excerpt}</p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                       <button onClick={() => onApproveSubmission(a)} className="bg-naija text-white px-6 md:px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-green-500/20">Approve Story</button>
                       <button onClick={() => onRejectSubmission(a.id)} className="bg-red-500 text-white px-6 md:px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">Reject Submission</button>
                    </div>
                  </div>
                ))}
                {pendingArticles.length === 0 && <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">No pending stories</div>}
              </div>
            )}
            {activeTab === 'ads' && (
              <div className="grid gap-6 md:gap-8">
                {ads.filter(ad => ad.status === 'Pending').map(ad => (
                   <div key={ad.id} className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border-l-8 border-yellow-500">
                     <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
                        <div>
                           <h3 className="font-bold text-xl md:text-2xl dark:text-white">{ad.plan}</h3>
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Client: {ad.clientName} ({ad.email})</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px]">Verify Payment</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 my-6 md:my-8">
                        <div className="space-y-4 text-center">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Creative / Ad Visual</p>
                           <img src={ad.adImage} className="max-h-48 md:max-h-64 mx-auto rounded-2xl shadow-xl border dark:border-gray-700" />
                        </div>
                        <div className="space-y-4 text-center">
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank Transfer Receipt</p>
                           <img src={ad.receiptImage} className="max-h-48 md:max-h-64 mx-auto rounded-2xl shadow-xl border dark:border-gray-700 cursor-zoom-in" onClick={() => window.open(ad.receiptImage, '_blank')} />
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-8 border-t dark:border-gray-700">
                        <button onClick={() => onApproveAd(ad.id)} className="flex-1 bg-naija text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Verify & Activate</button>
                        <button onClick={() => onRejectAd(ad.id)} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Decline Ad</button>
                     </div>
                   </div>
                ))}
                {ads.filter(ad => ad.status === 'Pending').length === 0 && <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">No pending advertisements</div>}
              </div>
            )}
            {activeTab === 'compose' && (
              <AdminComposeForm onSave={onPublish} />
            )}
          </>
        ) : (
          <AdminComposeForm 
            initialData={editingArticle} 
            onSave={handleEditSave} 
            onCancel={() => setEditingArticle(null)} 
          />
        )}
      </div>
    </div>
  );
};

const Footer: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => (
  <footer className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white pt-16 md:pt-24 pb-8 md:pb-12 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-12 md:mb-20 border-b border-gray-100 dark:border-gray-700 pb-12 md:pb-20">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-naija rounded-full flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-lg"><Globe className="w-6 h-6 md:w-7 md:h-7" /></div>
            <h2 className="font-sans text-lg md:text-xl font-bold text-gray-900 dark:text-white">The People’s Platform</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">Empowering Nigerian voices through unbiased reporting and community-driven journalism. No paywalls, just truth.</p>
        </div>
        <div>
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-6 md:mb-8">Key Sections</h3>
          <ul className="space-y-3 md:space-y-4 text-gray-700 dark:text-gray-300 text-sm font-bold">
            <li className="hover:text-naija cursor-pointer transition-colors">Government & Policy</li>
            <li className="hover:text-naija cursor-pointer transition-colors">National Pulse</li>
            <li className="hover:text-naija cursor-pointer transition-colors">Lifestyle & Arts</li>
            <li className="hover:text-naija cursor-pointer transition-colors">Metro Lagos & States</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-6 md:mb-8">Platform</h3>
          <ul className="space-y-3 md:space-y-4 text-gray-700 dark:text-gray-300 text-sm font-bold">
            <li onClick={() => onNavigate('advertise')} className="hover:text-naija cursor-pointer transition-colors">Advertise with Us</li>
            <li onClick={() => onNavigate('submit')} className="hover:text-naija cursor-pointer transition-colors">Submit Story</li>
            <li className="hover:text-naija cursor-pointer transition-colors">Privacy Policy</li>
            <li onClick={() => onNavigate('login')} className="cursor-pointer transition-colors text-[10px] opacity-20 hover:opacity-100 font-normal">Editorial Access</li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-6 md:mb-8">Connect With Us</h3>
          <div className="flex flex-row items-center justify-start gap-4 md:gap-6 flex-nowrap pr-6 overflow-hidden">
             <div className="text-slate-400 hover:text-naija transition-colors cursor-pointer shrink-0" title="Facebook"><SocialIcons.Facebook /></div>
             <div className="text-slate-400 hover:text-naija transition-colors cursor-pointer shrink-0" title="Instagram"><SocialIcons.Instagram /></div>
             <div className="text-slate-400 hover:text-naija transition-colors cursor-pointer shrink-0" title="Twitter"><SocialIcons.Twitter /></div>
             <div className="text-slate-400 hover:text-naija transition-colors cursor-pointer shrink-0" title="X"><SocialIcons.X /></div>
             <div className="text-slate-400 hover:text-naija transition-colors cursor-pointer shrink-0" title="YouTube"><SocialIcons.YouTube /></div>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed">© 2025 The People’s Platform Media Ltd.<br className="md:hidden" /> Built for the Pulse of the Nation.</div>
    </div>
  </footer>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
