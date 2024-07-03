<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { acceptInvite } from '../../apis/project'
import { toast } from '../../utils'
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const $route = useRoute()
const router = useRouter()
const projectId = $route.params.id as string
const code = $route.query.code as string

async function accept() {
  await acceptInvite(projectId, code)
  router.replace(`/icons/${projectId}`)
}

onMounted(async () => {
  if (projectId && code) {
    await accept().catch(() => {
      router.replace('/home')
    })
  } else {
    toast(t('invalidParams'))
    router.replace('/home')
  }
})
</script>
