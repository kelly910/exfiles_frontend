// Dev Pending
// import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
// import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';

// import NameAvatar from './NameAvatar';
// import Image from 'next/image';

// export default function LoadingGenerateSummary({
//   userDetails,
// }: {
//   userDetails: any;
// }) {
//   return (
//     <Box component="div" className={chatMessagesStyles.chatAl}>
//       <Box component="div" className={chatMessagesStyles.chatAlImg}>
//         <Tooltip title="Open settings">
//           <IconButton sx={{ p: 0 }}>
//             <Image
//               alt="Logo"
//               width={40}
//               height={40}
//               src="/images/close-sidebar-logo.svg"
//             />
//           </IconButton>
//         </Tooltip>
//       </Box>
//       <Box component="div" className={chatMessagesStyles.chatAlContent}>
//         <Typography
//           variant="body1"
//           className={chatMessagesStyles.chatAlContentText}
//         >
//           Hold on a second...
//         </Typography>
//         <Box component="div" className={chatMessagesStyles.chatAlCategory}>
//           <Box
//             component="div"
//             className={chatMessagesStyles.chatAlCategoryInner}
//           >
//             <Image
//               src="/images/category.svg"
//               alt="category"
//               width={14}
//               height={14}
//             />
//             <Typography
//               variant="body1"
//               className={chatMessagesStyles.chatAlText}
//             >
//               Generating Summary Links
//             </Typography>
//           </Box>
//         </Box>
//         <span className={chatMessagesStyles.chatTime}>04:57 AM</span>
//       </Box>
//     </Box>
//   );
// }
