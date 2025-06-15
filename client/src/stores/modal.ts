import { defineStore } from 'pinia'
import LoginModal from '../components/modals/LoginModal.vue'
import ChangePasswordModal from '../components/modals/ChangePasswordModal.vue'
import ChangeUsernameModal from '../components/modals/ChangeUsernameModal.vue'
import ChangePfpModal from '../components/modals/ChangePfpModal.vue'
import ChangeThemeModal from '../components/modals/ChangeThemeModal.vue'
import { ModalEnum } from '../types/ModalEnum'

export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as ModalEnum | null,
    modalProps: {} as Record<string, any>
  }),
  actions: {
    open(modalName: ModalEnum, props: Record<string, any> = {}) {
      this.activeModal = modalName
      this.modalProps = props
    },
    close() {
      this.activeModal = null
      this.modalProps = {}
    }
  },
  getters: {
    modalComponent(state) {
      const modalMapping: Record<ModalEnum, any> = {
        [ModalEnum.Login]: LoginModal,
        [ModalEnum.ChangePassword]: ChangePasswordModal,
        [ModalEnum.ChangeUsername]: ChangeUsernameModal,
        [ModalEnum.ChangePfp]: ChangePfpModal,
        [ModalEnum.ChangeTheme]: ChangeThemeModal
      }
      return state.activeModal ? modalMapping[state.activeModal] : null
    }
  }
})
