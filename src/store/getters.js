export const loading = ({
   state
}) => state.loading

export const userInfo = ({
   state
}) => state.meta.userInfo

export const messages = ({
   state
}) => state.meta.messages

export default {
   loading,
   userInfo,
   messages
}