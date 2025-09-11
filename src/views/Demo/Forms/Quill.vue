<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="quill-container">
      <div class="quill-content">
        <div>
          <QuillEditor :style="'height:300px'" ref="quillRef" :modules="modules" toolbar="full" />
        </div>
        <Button size="sm" @click="onClick" variant="primary"> Submit</Button>
        <Button size="sm" @click="onBind" variant="primary"> Bind</Button>

        <div v-html="rawHtml"></div>
      </div>
    </div>
  </AdminLayout>

</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader';

const quillRef = ref(null)
const rawHtml = ref('')
const currentPageTitle = ref('Quill');

const modules = ref({
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: file => {
      return new Promise(() => {
        const formData = new FormData();
        formData.append("image", file);

        // axios.post('/upload-image', formData)
        //   .then(res => {
        //     console.log(res)
        //     resolve(res.data.url);
        //   })
        //   .catch(err => {
        //     reject("Upload failed");
        //     console.error("Error:", err)
        //   })
      })
    }
  }
})


const onBind = async () => {
  quillRef?.value?.setHTML('<p>Áo thun DirtyCoins Dico Mate T-Shirt - White</p><p><br></p><p>Model: 1m55 42kg mặc sản phẩm size S</p><p><br></p><p>Chi tiết sản phẩm:</p><p>• Màu: Trắng - Đen - Kem</p><p>• Size: XS - S - M - L - XL</p><p>• Chất liệu: Cotton.</p><p>• Relaxed Fit.</p><p>• Bo cổ 2 chiều.</p><p>• Hình in mặt trước và sau áo áp dụng dụng công nghệ in lụa.</p><p><br></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-mdk6gpmpapwx49" height="1167" width="875"></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-mdk6gpmpc4hd85" height="1167" width="875"></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-mdo2snjimmr0e8" height="1094" width="875"></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-mdo2snjio1bgd9" height="1094" width="875"></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134202-7ras8-m0d2fgqox0q554" height="1326" width="875"></p><p><img src="https://down-vn.img.susercontent.com/file/vn-11134202-7ras8-m0d2fhdpzbhp19" height="1326" width="875"></p>')
}
const onClick = async () => {
  rawHtml.value = quillRef?.value?.getHTML()
  debugger
}
</script>
<style>
.quill-content {
  width: 950px;
}

.quill-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
