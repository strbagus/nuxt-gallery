export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const usePageMeta = () => {
  const title = useState('page-title', () => '')
  const layoutTitle = useState('layout-title', () => 'Baseline Project')
  const breadcrumbs = useState<BreadcrumbItem[] | null>('breadcrumbs', () => null)

  const setPageMeta = (newTitle: string, newBreadcrumbs: BreadcrumbItem[] | null = null, newLayoutTitle: string | null = null) => {
    title.value = newTitle
    breadcrumbs.value = newBreadcrumbs
    if (newLayoutTitle) {
      layoutTitle.value = newLayoutTitle
    }

    if (newTitle && import.meta.client) {
      document.title = `${newTitle} | ${layoutTitle.value}`
    }
  }

  return {
    title,
    layoutTitle,
    breadcrumbs,
    setPageMeta
  }
}
