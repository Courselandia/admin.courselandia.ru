import TId from '@/types/id';

const getLink = (id: TId, category: string): string | null => {
  if (category === 'course.text') {
    return `/dashboard/courses/${id}`;
  }

  if (category === 'skill.text') {
    return `/dashboard/skills/${id}`;
  }

  if (category === 'tool.text') {
    return `/dashboard/tools/${id}`;
  }

  return null;
};

export default getLink;
