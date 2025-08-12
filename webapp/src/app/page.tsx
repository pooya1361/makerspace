// app/page.tsx
import AvailableLessons from './components/AvailableLessons';
import SummaryDisplay from './components/SummaryDisplay';

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-sans">
      <div className="flex flex-col sm:items-start gap-16">
        <SummaryDisplay />
        <AvailableLessons />
      </div>
    </div>
  );
}
