import TId from '@/types/id';

const getLink = (id: TId, category: string): string | null => {
  if (category === 'course.text') {
    return `/dashboard/courses/${id}`;
  }

  if (category === 'skill.text') {
    return `/dashboard/skills/${id}`;
  }

  if (category === 'section.text') {
    return `/dashboard/sections/${id}`;
  }

  if (category === 'tool.text') {
    return `/dashboard/tools/${id}`;
  }

  if (category === 'direction.text') {
    return `/dashboard/directions/${id}`;
  }

  if (category === 'profession.text') {
    return `/dashboard/professions/${id}`;
  }

  if (category === 'category.text') {
    return `/dashboard/categories/${id}`;
  }

  if (category === 'school.text') {
    return `/dashboard/schools/${id}`;
  }

  if (category === 'teacher.text') {
    return `/dashboard/teachers/${id}`;
  }

  if (category === 'collection.text') {
    return `/dashboard/collections/${id}`;
  }

  return null;
};

export default getLink;
