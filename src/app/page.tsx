import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { defaultSkills } from "@/lib/default-data";
import { getPortfolioSnapshot } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, projects, experience, activities, research } = await getPortfolioSnapshot();

  return (
    <PortfolioPage 
      profile={profile} 
      projects={projects} 
      skills={defaultSkills} 
      experience={experience}
      activities={activities}
      research={research}
    />
  );
}
