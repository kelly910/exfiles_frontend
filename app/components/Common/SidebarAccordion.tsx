import { Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import Style from '@components/Common/Sidebar.module.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useThemeMode } from '@/app/utils/ThemeContext';

interface InnerAccordionItem {
  panelKey: string;
  title: string;
  // icon: string;
  children?: React.ReactNode;
}

interface SidebarAccordionProps {
  title: string;
  icon: string;
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
  const { theme } = useThemeMode();

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
            root: Style['customAccordionHeading'],
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
            <Image src={icon} alt="icon" width={18} height={18} />
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
