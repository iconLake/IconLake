<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { acceptInvite } from '../../apis/project'
import { toast } from '../../utils'

const $route = useRoute()
const router = useRouter()
const projectId = $route.params.id as string
const code = $route.query.code as string

async function accept() {
  await acceptInvite(projectId, code)
  router.replace(`/icons/${projectId}`)
}

if (projectId && code) {
  accept()
} else {
  toast('参数错误')
  router.replace('/home')
}
</script>
