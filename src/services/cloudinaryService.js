/**
 * Serviço para upload de imagens para Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param {File|string} file - Ficheiro ou data URL da imagem
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} URL da imagem carregada
 */
export async function uploadImage(file, options = {}) {
  try {
    const formData = new FormData()

    if (typeof file === 'string') {
      formData.append('file', file)
    } else {
      formData.append('file', file)
    }

    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.public_id) {
      formData.append('public_id', options.public_id)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Erro ao fazer upload da imagem')
    }

    const data = await response.json()

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    }
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao fazer upload',
    }
  }
}

/**
 * Gera URL otimizado da imagem do Cloudinary
 * @param {string} publicId - ID público da imagem no Cloudinary
 * @param {Object} transformations - Transformações a aplicar
 * @returns {string} URL otimizado
 */
export function getOptimizedUrl(publicId, transformations = {}) {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'auto',
    gravity = 'auto',
    quality = 'auto',
    format = 'auto',
  } = transformations

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`
  const params = []

  if (width !== 'auto') params.push(`w_${width}`)
  if (height !== 'auto') params.push(`h_${height}`)
  if (crop !== 'auto') params.push(`c_${crop}`)
  if (gravity !== 'auto') params.push(`g_${gravity}`)
  params.push(`q_${quality}`)
  params.push(`f_${format}`)

  const transformation = params.join(',')
  return `${baseUrl}/${transformation}/${publicId}`
}

/**
 * Gera URL de thumbnail
 * @param {string} publicId - ID público da imagem
 * @param {number} size - Tamanho do thumbnail
 * @returns {string} URL do thumbnail
 */
export function getThumbnailUrl(publicId, size = 200) {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'face',
  })
}
