import { reactive, toRefs } from 'vue'

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const state = reactive({
  title: '',
  layoutTitle: 'Baseline Project',
  breadcrumbs: null as BreadcrumbItem[] | null
})

export const usePageMeta = () => {
  const setPageMeta = (title: string, breadcrumbs: BreadcrumbItem[] | null = null, layoutTitle: string | null = null) => {
    state.title = title
    state.breadcrumbs = breadcrumbs
    if (layoutTitle) {
      state.layoutTitle = layoutTitle
    }
    if (title) {
      document.title = `${title} | ${state.layoutTitle}`
    }
  }

  return {
    ...toRefs(state),
    setPageMeta
  }
}
