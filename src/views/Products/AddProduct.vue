<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="space-y-6">
                <ComponentCard :title="$t('product.basicInfo')">
                    <div class="space-y-6">
                        <!-- Text Input -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productName') }}
                            </label>
                            <input type="text" :placeholder="$t('product.productName')" v-model="formData.input"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <!-- Select Input -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productCategory') }}
                            </label>
                            <div class="relative z-20 bg-transparent">
                                <select v-model="formData.selectInput"
                                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    :class="{ 'text-gray-800 dark:text-white/90': formData.selectInput }">
                                    <option value="" disabled selected>Select Option</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="template">Template</option>
                                    <option value="development">Development</option>
                                </select>
                                <span
                                    class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon class="stroke-current" width="20" height="20" />
                                </span>
                            </div>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productDescription') }}
                            </label>
                            <QuillEditor :style="'height:300px'" ref="quillRef" :modules="modules" toolbar="full" />
                        </div>

                    </div>
                </ComponentCard>
                <ComponentCard title="Inputs States">
                    <TextArea />
                </ComponentCard>
                <ComponentCard title="Inputs States">
                    <InputState />
                </ComponentCard>
            </div>
            <div class="space-y-6">
                <ComponentCard title="Inputs Group">
                    <div class="space-y-6">
                        <div class="product-variants-container space-y-6">
                            <div v-for="(productVariant, variantIndex) in product.productVariants" :key="variantIndex">
                                <div class="space-y-3">
                                    <div>
                                        <label
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 ">
                                            {{ $t('product.variant') }}
                                        </label>
                                        <input type="text" :placeholder="$t('product.fill')"
                                            v-model="productVariant.name"
                                            class="w-full dark:bg-dark-900 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                    </div>
                                    <div>
                                        <label
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            {{ $t('product.option') }}
                                        </label>
                                        <div class="space-y-2">
                                            <div v-for="(option, optionIndex) in productVariant.options"
                                                :key="option.optionId">
                                                <input @input="onChangeVariantOption(variantIndex, optionIndex)"
                                                    type="text" :placeholder="$t('product.fill')" v-model="option.value"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button @click="onClickAddNewVariant" size="sm" variant="outline" :startIcon="PlusIcon"> {{
                            $t('product.addNewVariant') }}
                        </Button>
                        <div v-show="product.productVariants?.length > 0"
                            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <div class="max-w-full overflow-x-auto custom-scrollbar">
                                <table class="min-w-full">
                                    <thead>
                                        <tr class="border-b border-gray-200 dark:border-gray-700">
                                            <th v-for="(variant, variantIndex) in product.productVariants"
                                                class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    variant.name || $t('product.variantGroup') + ' ' + (variantIndex +
                                                    1)
                                                    }}</p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.price')
                                                    }}</p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.inventory') }}
                                                </p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.sku') }}</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="productSku in product.productSkus" :key="productSku.id"
                                            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">

                                            <td v-for="(variant, variantIndex) in product.productVariants"
                                                class="px-5 py-4 sm:px-6">
                                                <div class="text-sm text-gray-900 dark:text-white">{{
                                                    getVariantValueBySKU(productSku, variant) }}
                                                </div>
                                            </td>

                                            <td class="px-5 py-4 sm:px-6">
                                                <input type="text" v-model="productSku.price"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                            </td>

                                            <td class="px-5 py-4 sm:px-6">
                                                <input type="text" v-model="productSku.quantity"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                            </td>
                                            <td class="px-5 py-4 sm:px-6">
                                                <input type="text" v-model="productSku.skuNo"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                            </td>


                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="space-y-6" v-if="product.productVariants.length == 0">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                    {{ $t('product.inventory') }}
                                </label>
                                <input type="text" :placeholder="$t('product.typeHere')" v-model="formData.input"
                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                            </div>
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="File Input">
                    <FileInput />
                </ComponentCard>
                <ComponentCard title="Check box">
                    <CheckboxInput />
                </ComponentCard>
                <ComponentCard title="Radio Buttons">
                    <RadioGroups />
                </ComponentCard>
                <ComponentCard title="Toggle Switch">
                    <ToggleSwitches />
                </ComponentCard>
                <ComponentCard title="Dropzone">
                    <Dropzone />
                </ComponentCard>
            </div>
        </div>
        <div
            class="toolbar fixed bottom-0 left-0 w-full flex justify-end gap-3 p-4 bg-white dark:bg-gray-900 shadow-lg z-50">
            <Button variant="outline" size="sm" @click="onCancel" className="min-w-[90px]">
                {{ $t('common.cancel') }}
            </Button>
            <Button variant="primary" size="sm" @click="onSave" className="min-w-[90px]">
                {{ $t('common.save') }}
            </Button>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import DefaultInputs from '@/views/Demo/Forms/DefaultInputs.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import SelectInput from '@/views/Demo/Forms/SelectInput.vue';
import InputState from '@/views/Demo/Forms/InputState.vue';
import TextArea from '@/views/Demo/Forms/TextArea.vue';
import InputGroup from '@/views/Demo/Forms/InputGroup.vue';
import Dropzone from '@/components/common/Dropzone.vue';
import FileInput from '@/components/common/FileInput.vue';
import ToggleSwitches from '@/views/Demo/Forms/ToggleSwitches.vue';
import CheckboxInput from '@/views/Demo/Forms/CheckboxInput.vue';
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader';
import MultipleSelect from '@/components/common/MultipleSelect.vue'
import Select from '@/components/common/Select.vue'
import Input from '@/components/common/Input.vue'
import MailIcon from '@/icons/MailIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import CopyIcon from '@/icons/CopyIcon.vue'
import Button from '@/components/common/Button.vue';
import { PlusIcon } from '@/icons';
import _ from 'lodash';
import { productService } from '@/services/product.service'
import { useAppStore } from '@/stores/app'
import type { CreateProductRequest, ProductVariant, ProductSku } from '@/types'

// Declare modules for missing types
// @ts-ignore
declare module 'quill-image-uploader';
// @ts-ignore
declare module 'lodash';

const appStore = useAppStore()

const currentPageTitle = ref('Form Elements');
const formData = ref<{ input?: string; selectInput?: string }>({})
const product = ref<{ productVariants: ProductVariant[]; productSkus: ProductSku[] }>({
    productVariants: [],
    productSkus: []
})
const quillRef = ref<any>(null)

const modules = ref({
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: (file: File) => {
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

const onClickAddNewVariant = () => {
    const defaultVariantValue = {
        id: crypto.randomUUID(),
        name: "",
        options: [
            {
                optionId: crypto.randomUUID(),
                value: ''
            }
        ]
    }
    if (product.value.productVariants) {
        product.value.productVariants.push(defaultVariantValue)
    } else {
        product.value.productVariants = [defaultVariantValue]
    }
}
const onChangeVariantOption = (variantIndex: number, optionIndex: number) => {
    if (!product.value?.productVariants?.[variantIndex]?.options) return;
    let isOptionAdded = false;
    if (optionIndex == product.value.productVariants[variantIndex].options.length - 1) {
        product.value.productVariants[variantIndex].options.push({
            optionId: crypto.randomUUID(),
            value: ''
        });
        isOptionAdded = true;
    }

    const option = product.value.productVariants[variantIndex].options[optionIndex];
    const productVariant = product.value.productVariants[variantIndex];

    if (!option?.value) return;

    updateProductSkus(productVariant, option, isOptionAdded);
}

const updateProductSkus = (productVariant: ProductVariant, option: { optionId: string; value: string }, isOptionAdded: boolean) => {
    if (!product.value.productSkus) product.value.productSkus = [];

    if (!isOptionAdded) {
        product.value.productSkus.forEach(productSku => {
            let foundOption = productSku.skuVariants.find(x => x.optionId == option.optionId)
            if (foundOption) {
                foundOption.value = option.value;
            }
        })
        return;
    }

    // Find all variants
    const variants = product.value.productVariants || [];
    // Build an array of arrays of options for each variant
    const optionsList = variants.map(v => (v.options || []).filter(o => o.value && o.value.trim() !== '' && (o.optionId == option.optionId || productVariant.id !== v.id)));
    // If any variant has no options, do nothing
    if (optionsList.some(opts => opts.length === 0)) return;

    // Helper: cartesian product
    function cartesian(arr: any[][]) {
        return arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
    }

    // Build all possible combinations
    const combinations = cartesian(optionsList);

    // Add new SKUs for new combinations
    combinations.forEach(combo => {
        // Build skuVariants for this combo
        const skuVariants = combo.map((o: any, idx: number) => ({
            variantId: variants[idx].id,
            value: o.value,
            optionId: o.optionId,
        }));
        // Add to productSkus
        product.value.productSkus.push({
            id: crypto.randomUUID(),
            skuVariants,
        });
    });
    product.value.productSkus = product.value.productSkus.filter(productSku => productSku.skuVariants.length === product.value.productVariants.length)

};


const getVariantValueBySKU = (productSku: ProductSku, variant: ProductVariant) => {
    if (!productSku || !Array.isArray(productSku.skuVariants) || !variant) return '';
    const variantId = variant.id;
    const matched = productSku.skuVariants.find(sv => sv.variantId === variantId);
    return matched?.value || '';
}

const onCancel = () => {
}
const onSave = async () => {
    try {
        // Compose product payload from form
        const payload = {
            name: formData.value.input || '',
            category: formData.value.selectInput || '',
            description: quillRef.value?.getHTML ? quillRef.value.getHTML() : '',
            productVariants: product.value.productVariants,
            productSkus: product.value.productSkus,
        }
        await productService.createProduct(payload)
        appStore.notifySuccess('Success', 'Product saved successfully!')
        // Optionally, reset form or navigate
    } catch (error: any) {
        appStore.notifyError('Error', error?.message || 'Failed to save product')
    }
}
</script>
<style scoped>
:deep(.ql-toolbar.ql-snow) {
    margin-bottom: 0px;
}

</style>