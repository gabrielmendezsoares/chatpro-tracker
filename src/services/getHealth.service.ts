import osu from 'node-os-utils';
import { HttpClientUtil, loggerUtil, BasicAndBearerStrategy } from '../../expressium/index.js';
import { IChatProBalanceMap, IChatProInstanceMap, IInstanceMap, IInstanceStatusMap, IPropertyMap, IResponse, IResponseData } from './interfaces/index.js';

export const getHealth = async (): Promise<IResponse.IResponse<IResponseData.IGetHealthResponseData>> => {
  try {
    const httpClientInstance = new HttpClientUtil.HttpClient();

    httpClientInstance.setAuthenticationStrategy(
      new BasicAndBearerStrategy.BasicAndBearerStrategy(
        'post',
        'https://api.chatpro.com.br/painel/ws/endpoint.php?action=token',
        undefined,
        undefined,
        undefined,
        undefined,
        {
          email: process.env.CHAT_PRO_EMAIL ?? 'email@gmail.com',
          senha: process.env.CHAT_PRO_PASSWORD ?? 'password'
        },
        (response: Axios.AxiosXHR<any>): string => response.data.token
      )
    );
  
    const [
      chatProBalanceMap, 
      chatProInstanceMap
    ] = await Promise.allSettled(
      [
        httpClientInstance.get<IChatProBalanceMap.IChatProBalanceMap>('https://api.chatpro.com.br/painel/ws/endpoint.php?action=saldo'),
        httpClientInstance.get<IChatProInstanceMap.IChatProInstanceMap>('https://api.chatpro.com.br/painel/ws/endpoint.php?action=instancias')
      ]
    );
  
    httpClientInstance.clearAuthenticationStrategy();
  
    const propertyMap: Record<string, IPropertyMap.IPropertyMap> = {};
  
    if (chatProBalanceMap.status === 'fulfilled') {
      const balance = chatProBalanceMap.value.data.user.saldo;
  
      if (balance) {
        propertyMap.balance = {
          name: 'Saldo',
          value: balance
        };
      }
    }
  
    if (chatProInstanceMap.status === 'fulfilled') {
      await Promise.allSettled(
        Object
          .values(chatProInstanceMap.value.data.instances)
          .map(
            async (instanceMap: IInstanceMap.IInstanceMap): Promise<void> => {
              try {
                const instanceStatusMap = await httpClientInstance.get<IInstanceStatusMap.IInstanceStatusMap>(
                  `https://v5.chatpro.com.br/${ instanceMap.code }/api/v1/status`,
                  { headers: { Authorization: instanceMap.token } }
                );
  
                const instanceStatusMapData = instanceStatusMap.data;
  
                if (instanceStatusMapData.connected) {
                  propertyMap[instanceMap.code] = {
                    name: instanceMap.code,
                    value: 'Online',
                    isListeningModifiedEvent: true
                  };
                } else {
                  propertyMap[instanceMap.code] = {
                    name: instanceMap.code,
                    value: 'Offline',
                    isListeningModifiedEvent: true
                  };
                }
              } catch (error: unknown) {
                propertyMap[instanceMap.code] = {
                  name: instanceMap.title,
                  value: 'Offline',
                  isListeningModifiedEvent: true
                };
              }
            }
          )
      );
    }
  
    return {
      status: 200,
      data: {
        monitor: {
          cpuUsage: {
            name: 'Uso de CPU',
            value: `${ (await osu.cpu.usage()).toFixed(1) }%`
          },
          memoryUsage: {
            name: 'Uso de memória',
            value: `${ (await osu.mem.used()).usedMemMb.toFixed(1) }MB`
          },
          port: {
            name: 'Porta',
            value: process.env.PORT ?? '3000',
            isListeningModifiedEvent: true
          },
          logLevel: {
            name: 'Nível de log',
            value: process.env.LOG_LEVEL ?? 'info',
            isListeningModifiedEvent: true
          },
          ...propertyMap
        }
      }
    };
  } catch (error: unknown) {
    loggerUtil.error(error instanceof Error ? error.message : String(error));

    return {
      status: 200,
      data: {
        monitor: {
          cpuUsage: {
            name: 'Uso de CPU',
            value: `${ (await osu.cpu.usage()).toFixed(1) }%`
          },
          memoryUsage: {
            name: 'Uso de memória',
            value: `${ (await osu.mem.used()).usedMemMb.toFixed(1) }MB`
          },
          port: {
            name: 'Porta',
            value: process.env.PORT ?? '3000',
            isListeningModifiedEvent: true
          },
          logLevel: {
            name: 'Nível de log',
            value: process.env.LOG_LEVEL ?? 'info',
            isListeningModifiedEvent: true
          }
        }
      }
    };
  }
};
