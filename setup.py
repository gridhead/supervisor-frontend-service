import codecs
import os.path
import setuptools


# use README.md as readme
def readme():
    with open('README.md') as f:
        return f.read()


# get __version__ from a file
def read(rel_path):
    here = os.path.abspath(os.path.dirname(__file__))
    with codecs.open(os.path.join(here, rel_path), 'r') as fp:
        return fp.read()


def get_version(rel_path):
    for line in read(rel_path).splitlines():
        if line.startswith('__version__'):
            delim = '"' if '"' in line else "'"
            return line.split(delim)[1]
    else:
        raise RuntimeError("Unable to find version string.")


# setuptools configuration
setuptools.setup(
    name='svfrontend',
    description='SuperVisor Frontend Service',
    long_description=readme(),
    long_description_content_type="text/markdown",
    url='https://github.com/t0xic0der/supervisor-frontend-service',
    author='Akashdeep Dhar',
    license='GPLv3',
    # extract version from source
    version=get_version("src/svfrontend/__init__.py"),
    # tell distutils packages are under src directory
    package_dir={
      '': 'src',
    },
    include_package_data=True,
    packages=setuptools.find_packages('src'),
    install_requires=[
      'flask'
    ],
    # automatically create console scripts
    entry_points={
      'console_scripts': ['svfrontend=svfrontend.main:mainfunc'],
    },
    classifiers=[
      'Development Status :: 4 - Beta',
      'Environment :: Console',
      'Intended Audience :: End Users/Desktop',
      'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
      'Natural Language :: English',
      'Programming Language :: Python :: 3',
      'Operating System :: POSIX :: Linux',
      'Topic :: System :: Hardware :: Hardware Drivers',
      'Topic :: Utilities',
    ],
)
