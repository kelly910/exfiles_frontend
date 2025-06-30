import { Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import Style from '@components/Common/Sidebar.module.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useThemeMode } from '@/app/utils/ThemeContext';
import { usePathname } from 'next/navigation';

interface InnerAccordionItem {
  panelKey: string;
  title: string;
  // icon: string;
  children?: React.ReactNode;
}

interface SidebarAccordionProps {
  title: string;
  icon: string;
  matchPath: string;
  expanded: string | boolean;
  panelKey: string;
  handleAccordionChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  children?: React.ReactNode;
  closeDocumentSummary?: () => void;
  expandPanel?: (panel: string | boolean) => void;
  handleClickOpenSidebar?: () => void;
  isOpen?: boolean;
  innerAccordions?: InnerAccordionItem[];
  expandedNested?: string | false;
  setExpandedNested?: (panelKey: string | false) => void;
}

const SidebarAccordion = ({
  title,
  icon,
  expanded,
  panelKey,
  handleAccordionChange,
  children,
  closeDocumentSummary,
  expandPanel,
  handleClickOpenSidebar,
  isOpen,
  innerAccordions = [],
  expandedNested,
  setExpandedNested,
  matchPath,
}: SidebarAccordionProps) => {
  const redirection = (expanded: string) => {
    if (expanded === 'panel3') {
      // router.push('/documents');
    } else if (expanded === 'panel1' || expanded === 'panel2') {
      closeDocumentSummary?.();
    }
    expandPanel?.('panel2');
  };

  const innerExpanded = expandedNested;
  const handleInnerAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedNested?.(isExpanded ? panel : false);
    };
  const pathname = usePathname();
  const isActive = pathname?.includes(matchPath);
  const { theme } = useThemeMode();

  const messages = () => {
    return theme === 'dark' ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.8925 4.5H5.0925C4.8975 4.5 4.71 4.5075 4.53 4.53C2.5125 4.7025 1.5 5.895 1.5 8.0925V11.0925C1.5 14.0925 2.7 14.685 5.0925 14.685H5.3925C5.5575 14.685 5.775 14.7975 5.8725 14.925L6.7725 16.125C7.17 16.6575 7.815 16.6575 8.2125 16.125L9.1125 14.925C9.225 14.775 9.405 14.685 9.5925 14.685H9.8925C12.09 14.685 13.2825 13.68 13.455 11.655C13.4775 11.475 13.485 11.2875 13.485 11.0925V8.0925C13.485 5.7 12.285 4.5 9.8925 4.5ZM4.875 10.5C4.455 10.5 4.125 10.1625 4.125 9.75C4.125 9.3375 4.4625 9 4.875 9C5.2875 9 5.625 9.3375 5.625 9.75C5.625 10.1625 5.2875 10.5 4.875 10.5ZM7.4925 10.5C7.0725 10.5 6.7425 10.1625 6.7425 9.75C6.7425 9.3375 7.08 9 7.4925 9C7.905 9 8.2425 9.3375 8.2425 9.75C8.2425 10.1625 7.9125 10.5 7.4925 10.5ZM10.1175 10.5C9.6975 10.5 9.3675 10.1625 9.3675 9.75C9.3675 9.3375 9.705 9 10.1175 9C10.53 9 10.8675 9.3375 10.8675 9.75C10.8675 10.1625 10.53 10.5 10.1175 10.5Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
        <path
          d="M16.4849 5.0925V8.0925C16.4849 9.5925 16.0199 10.6125 15.0899 11.175C14.8649 11.31 14.6024 11.13 14.6024 10.8675L14.6099 8.0925C14.6099 5.0925 12.8924 3.375 9.89244 3.375L5.32494 3.3825C5.06244 3.3825 4.88244 3.12 5.01744 2.895C5.57994 1.965 6.59994 1.5 8.09244 1.5H12.8924C15.2849 1.5 16.4849 2.7 16.4849 5.0925Z"
          fill={
            isActive === true ? 'var(--Icon-Color)' : 'var(--Subtext-Color)'
          }
        />
      </svg>
    ) : (
      <Image src="/images/messages.svg" alt="icon" width={18} height={18} />
    );
  };
  function renderIcon() {
    if (icon === 'messages') {
      return messages();
    }
    return null;
  }

  return (
    <Tooltip title={!isOpen ? title : ''} placement="right" arrow>
      <Accordion
        className={`${Style['accordian']}`}
        expanded={expanded === panelKey}
        onChange={handleAccordionChange(panelKey)}
        sx={{
          borderRadius: '10px !important',
          overflow: 'hidden',
          'span.Mui-expanded': {
            transform: 'rotate(0deg)',
          },
          'span.MuiAccordionSummary-expandIconWrapper': {
            '& img': {
              filter: theme === 'dark' ? 'brightness(1) invert(1)' : 'unset',
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <Image
              className={Style['img-none']}
              src={
                expanded === panelKey
                  ? '/images/arrow-down.svg'
                  : '/images/arrow-down-right.svg'
              }
              alt="expand-collapse"
              width={16}
              height={16}
            />
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          aria-controls={`${panelKey}-content`}
          id={`${panelKey}-header`}
          classes={{
            root: `${Style['customAccordionHeading']} ${isActive ? Style['active'] : ''}`,
            content: Style['customAccordionContent'],
          }}
          onClick={handleClickOpenSidebar}
          sx={{
            borderRadius: '10px !important',
            backgroundColor:
              expanded === panelKey
                ? 'var(--Input-Box-Colors)'
                : 'var(--Card-Color)',
          }}
        >
          <Typography
            component="span"
            className={Style['heading']}
            onClick={() => redirection(panelKey)}
          >
            {/* <Image src={icon} alt="icon" width={18} height={18} /> */}
            {renderIcon()}
            {title}
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          className={Style['bottom-content']}
          sx={{ marginTop: '10px' }}
        >
          {children}

          {innerAccordions.map((inner) => (
            <Accordion
              key={inner.panelKey}
              className={Style['accordian']}
              expanded={innerExpanded === inner.panelKey}
              onChange={handleInnerAccordionChange(inner.panelKey)}
              sx={{
                backgroundColor:
                  theme === 'dark'
                    ? 'var(--Txt-On-Gradient) !important'
                    : 'transparent !important',
                borderRadius: '10px !important',
                overflow: 'hidden',
                'span.Mui-expanded': {
                  transform: 'rotate(0deg)',
                },
                '.Mui-expanded': {
                  borderRadius: '10px 10px 0 0 !important',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Image
                    className={`${Style['img-none']} ${Style['img-none-inner']}`}
                    src={
                      innerExpanded === inner.panelKey
                        ? '/images/arrow-down.svg'
                        : '/images/arrow-down-right.svg'
                    }
                    alt="expand-collapse"
                    width={16}
                    height={16}
                  />
                }
                aria-controls={`${inner.panelKey}-content`}
                id={`${inner.panelKey}-header`}
                classes={{
                  root: Style['customAccordionHeading'],
                  content: Style['customAccordionContent'],
                }}
                sx={{
                  borderRadius: '10px !important',
                  backgroundColor:
                    innerExpanded === inner.panelKey
                      ? 'var(--Input-Box-Colors)'
                      : 'var(--Card-Color)',
                }}
              >
                <Typography
                  component="span"
                  className={`${Style['heading']} ${Style['heading-inner']}`}
                >
                  {/* <Image src={inner.icon} alt="icon" width={16} height={16} /> */}
                  {inner.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails className={Style['bottom-content']}>
                {inner.children}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    </Tooltip>
  );
};

export default SidebarAccordion;
