import { MestreLeadDashboard } from '@/components/mestrelead-dashboard';
import { getChatGPTUser } from './chatgpt-auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getChatGPTUser();
  return <MestreLeadDashboard userName={user?.displayName ?? 'Paulo Tironi'} />;
}
